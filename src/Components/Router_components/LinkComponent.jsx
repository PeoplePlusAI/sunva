import React from 'react';
import { Link } from 'react-router-dom'

const LinkComponent = ({
    componentFrom,
    to,
    className,
    title,
    onClick
}) => {
  return (
    <Link to={to} className={className} onClick={onClick}>{title}</Link>
  )
}

export default LinkComponent