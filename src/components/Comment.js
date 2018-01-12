import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { If, Then, Else } from 'react-if'
import { FaAngleUp, FaAngleDown, FaEdit, FaClose, FaBan } from 'react-icons/lib/fa'
import '../comment.css'
class Comment extends Component {

	state = {
		editting: false,
	}

	toggleEditting() {
		this.setState({ editting: !this.state.editting })
	}

	isEditting() {
		return this.state.editting
	}

	render() {
		const { id, voteScore, author, body } = this.props.comment
		return (
			<section id={id} className="comment">
				<If condition={this.isEditting() === false}>
					<Then>
						<section className="comment-wrapper">
							<section className="vote-score-section">
								<FaAngleUp/>
									<p>{voteScore}</p>
								<FaAngleDown/>
							</section>
							<section className="comment-section">
								<section className="comment-header">
									<h3>by {author}
									</h3>
									<div className="edit-button" onClick={() => this.toggleEditting()}>
										<FaEdit/>
									</div>
									<div className="delete-button">
										<FaClose/>
									</div>
								</section>
								<section className="comment-body">
									<p>{body}</p>
								</section>
							</section>
						</section>
					</Then>
					<Else>
							<form >
						<section className="comment-wrapper">
								<section className="vote-score-section">
									<FaAngleUp/>
										<p>{voteScore}</p>
									<FaAngleDown/>
								</section>
								<section className="comment-section">
									<section className="comment-header">
										<input className="comment-author-input" type="text" defaultValue={author} placeholder="ex.: Alan Brochier"/>
										<div className="cancel-button" onClick={() => this.toggleEditting()}>
											<FaBan/>
										</div>
									</section>
									<section className="comment-body">
										<textarea className="comment-body-input" defaultValue={body} placeholder="Write your commentary here...">
										</textarea>
										<input type="submit" value="Send"/>
									</section>
								</section>
						</section>
							</form>
					</Else>
				</If>
			</section>
		)
	}
}

Comment.propTypes = {
	id: PropTypes.string,
	voteScore: PropTypes.number,
	author: PropTypes.string,
	body: PropTypes.string,
}

export default Comment