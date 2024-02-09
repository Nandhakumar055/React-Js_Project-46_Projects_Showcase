import './index.css'

const ProjectListItem = props => {
  const {projectListItem} = props
  const {name, imageUrl} = projectListItem

  return (
    <li className="project-item-container">
      <img src={imageUrl} alt={name} className="project-thumbnail" />
      <p className="project-name">{name}</p>
    </li>
  )
}

export default ProjectListItem
