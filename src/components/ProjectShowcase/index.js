import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectListItem from '../ProjectListItem'

import './index.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiResponseStatusConstant = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProjectShowcase extends Component {
  state = {
    projectCategory: categoriesList[0].id,
    apiStatus: apiResponseStatusConstant.initial,
    projectsList: [],
  }

  componentDidMount() {
    this.getProjects()
  }

  onChangeProjectCategory = event => {
    this.setState(
      {projectCategory: event.target.value.toUpperCase()},
      this.getProjects,
    )
  }

  getProjects = async () => {
    this.setState({apiStatus: apiResponseStatusConstant.inProgress})
    const {projectCategory} = this.state

    const projectsApiUrl = `https://apis.ccbp.in/ps/projects?category=${projectCategory}`
    const options = {
      method: 'GET',
    }

    const response = await fetch(projectsApiUrl, options)
    const projectsData = await response.json()
    if (response.ok === true) {
      const updateData = projectsData.projects.map(eachCategory => ({
        id: eachCategory.id,
        imageUrl: eachCategory.image_url,
        name: eachCategory.name,
      }))
      this.setState({
        projectsList: updateData,
        apiStatus: apiResponseStatusConstant.success,
      })
    } else {
      this.setState({apiStatus: apiResponseStatusConstant.failure})
    }
  }

  renderSuccessView = () => {
    const {projectsList} = this.state
    return (
      <ul className="projects-container">
        {projectsList.map(eachCategory => (
          <ProjectListItem
            key={eachCategory.id}
            projectListItem={eachCategory}
          />
        ))}
      </ul>
    )
  }

  renderFailureView = () => {
    const onClickRetryButton = () => {
      this.getProjects()
    }

    return (
      <div className="failure-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
          alt="failure view"
          className="failure-view-image"
        />
        <h1 className="failure-view-error-msg">Oops! Something Went Wrong</h1>
        <p className="failure-view-dec">
          We cannot seem to find the page you are looking for
        </p>
        <button
          className="retry-button"
          type="button"
          onClick={onClickRetryButton}
        >
          Retry
        </button>
      </div>
    )
  }

  renderInProgressView = () => (
    <div data-testid="loader" className="loading-container">
      <Loader type="ThreeDots" color="rgb(0, 68, 255)" height="50" width="50" />
    </div>
  )

  renderApiResponse = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiResponseStatusConstant.success:
        return this.renderSuccessView()

      case apiResponseStatusConstant.failure:
        return this.renderFailureView()

      case apiResponseStatusConstant.inProgress:
        return this.renderInProgressView()

      default:
        return null
    }
  }

  render() {
    return (
      <div className="project-showcase-route-container">
        <div className="header-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="web-logo-image"
          />
        </div>
        <div className="body-container">
          <select
            className="project-category-selection"
            onChange={this.onChangeProjectCategory}
          >
            {categoriesList.map(eachCategory => (
              <option
                id={eachCategory.id}
                key={eachCategory.id}
                value={eachCategory.id}
                className="project-category-option"
              >
                {eachCategory.displayText}
              </option>
            ))}
          </select>
          <div className="project-main-container">
            {this.renderApiResponse()}
          </div>
        </div>
      </div>
    )
  }
}

export default ProjectShowcase
