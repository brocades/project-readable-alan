import React, { Component } from 'react'
import { connect } from 'react-redux'
import '../submitpost.css'
import * as ReadableAPI from '../ReadableAPI'
import { FaClose } from 'react-icons/lib/fa'
import serializeForm from 'form-serialize'
import PropTypes from 'prop-types'
import { sendPost, closeSubmitModal } from '../actions'
const uuidv1 = require('uuid/v1');

class PostSubmit extends Component {

	state = {
		selectedCategory: "react",
	}

	initializeView() {
		this.controlSelectedColor(this.state.selectedCategory)
	}

	handlePostUpload = (e) => {
		e.preventDefault()
		const defaultValues = {
			id: uuidv1(),
			timestamp: Date.now(),
			commentCount: 0,
			voteScore: 1,
			deleted: false,
			category: this.state.selectedCategory,
		}
		const inputValues = serializeForm(e.target, { hash: true })
		const post = {
			...defaultValues,
			...inputValues
		}
		this.props.uploadPost(post)
		ReadableAPI.uploadPost(post)
			.catch((reason) => {
				console.log(`>>> Post not uploaded due to: ${reason}`)
			})
		this.props.closeSubmitModal()
		this.resetInputform()
	}

	controlSelectedColor = (selectedCategory) => {
    const categoryButtons = document.getElementsByClassName("postsubmit-category-button")

    for (let button of categoryButtons) {
        button.classList.remove("category-button-selected")
      if (selectedCategory === button.value) {
        button.classList.add("category-button-selected")
      }
    }
  }

  selectCategory = (categoryName) => {
  	this.setState({
  		selectedCategory: categoryName,
  	})
    this.controlSelectedColor(categoryName)
  }

	resetInputform = () => {
		const postUploadForm = document.getElementById("postUploadForm")
		postUploadForm.reset()
	}

	getValidCategories() {
		const categories = this.props.categories
		const categoriesList = [ ...categories]
		return categoriesList.slice(1)
	}

	componentDidMount() {
		this.initializeView()
	}

	render() {
		const categories = this.getValidCategories()
		return (
			<div className="postsubmit-modal">
				<section className="postsubmit-wrapper">
					<FaClose onClick={this.props.closeSubmitModal} className="postsubmit-close-modal"/>
					<form id="postUploadForm" className="postsubmit-upload-form" onSubmit={this.handlePostUpload}>
						<section className="postsubmit-section">
							<section className="postsubmit-header">
								<label>
									Category
								</label>
								<div className="buttons-group">
									{categories.map((category) => (
										<button type="button" className="postsubmit-category-button"
											key={category.path}
											value={category.name}
											onClick={() => this.selectCategory(category.name)}>
											{category.name}
										</button>
									))}
								</div>

								<label>
									Title
								</label>
								<input required autofocus
									className="postsubmit-title-input"
									type="text"
									name="title"/>

								<label>
									Author
								</label>
								<input required
									className="postsubmit-author-input"
									type="text"
									name="author"/>
							</section>
							<section className="postsubmit-body">
								<label>
									Content
								</label>
								<textarea required
									className="postsubmit-body-input"
									name="body">
								</textarea>
								<button
									type="submit"
									value="Send"
									className="postsubmit-input-button"
									>Send</button>
							</section>
						</section>
					</form>
				</section>
			</div>
		)
	}
}

PostSubmit.propTypes = {
	title: PropTypes.string,
	author: PropTypes.string,
	body: PropTypes.string,
}

const mapStateToProps = ({ post }) => ({
	categories: post.categories
})

const mapDispatchToProps = (dispatch) => ({
	uploadPost: (data) => dispatch(sendPost(data)),
	closeSubmitModal: () => dispatch(closeSubmitModal()),
})

export default connect(mapStateToProps, mapDispatchToProps)(PostSubmit)