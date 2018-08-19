import React from 'react'
import { Link } from 'react-router-dom'

const NoMatch = ({ location }) => (
	<section style={{"margin": "0 auto", "width": "100%", "text-align": "center"}}>
		<h3>No match for <code>{location.pathname}</code></h3>
		<div>
			<Link key="back" to="/">
				<button>
					See All posts
                </button>
			</Link>
		</div>
	</section>
)

export default NoMatch