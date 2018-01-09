import React, { Component } from 'react'
import { FaAngleUp, FaAngleDown, FaEdit, FaClose } from 'react-icons/lib/fa'
import '../comment.css'
class Comment extends Component {

	render() {
		const testState = {
	    id: '894tuq4ut84ut8v4t8wun89g',
	    parentId: "8xf0y6ziyjabvozdd253nd",
	    timestamp: 1468166872634,
	    body: 'Hi there! I am a COMMENT.',
	    author: 'thingtwo',
	    voteScore: 6,
	    deleted: false,
	    parentDeleted: false
	  }
		return (
			<section className="comment">
				<section className="vote-score-section">
					<FaAngleUp/>
						<p>{testState.voteScore}</p>
					<FaAngleDown/>
				</section>
				<section className="comment-section">
					<section className="comment-header">
						<h3>by {testState.author}
						</h3>
						<div className="edit-button">
							<FaEdit/>
						</div>
						<div className="delete-button">
							<FaClose/>
						</div>
					</section>
					<section className="comment-body">
						<p>{testState.body}</p>
					</section>
				</section>
			</section>
		)
	}
}

export default Comment