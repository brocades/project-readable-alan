# Readable Project

In my application 5 components were developed following the requirements exposed on the project specification page:

* [`CategoryPosts`](#CategoryPosts)
* [`Comment`](#Comment)
* [`Post`](#Post)
* [`PostDetails`](#PostDetails)
* [`PostSubmit`](#PostSubmit)

## Running the application

In order to run the application you will need to install all its dependencies first by running the command `npm install` while in the subdirectory `/frontend`
and then, after all dependencies are installed, two steps must be followed:

* run the server with `node server` while in the subdirectory `/api-server`
* run the application with `npm start` while in the subdirectory `/frontend`

## Components

### **CategoryPosts**

*Stateless*

This component is responsible for filtering posts according to their respective category.

#### Props

```js
category
```
* `category`: `<String>` containing the respective selected category

#### Mapped props

```js
posts
```

### **Comment**

#### State

```js
state = {
  editting: false,
}
```

* `editting`: `<Boolean>` used to enable and control inline editting

#### Props

```js
comment, type
```

* `comment`: `<Comment>` containing a Comment object to be displayed
* `type`: `<String>` containing a type of comment, either *details* or *display*

#### Mapped props

```js
uploadComment, updateComment, deleteComment, voteComment
```

#### Functions

* `toggleEditting()`: controls inline comment editting
* `isEditting()`: return current editting state
* `resetInputForm()`: reset comment input form fields
* `getCommentProps(id)`: checks for the existence of props that are used inside the render function
* `handleCommentUpload(event)`
* `handleCommentUpdate(event)`
* `deleteComment(comment)`
* `upVoteComment(id)`
* `downVoteComment(id)`

### **Post**

#### State

```js
state = {
  editting: false,
}
```

* `editting`: `<Boolean>` used to enable and control inline editting

#### Props

```js
post, key, type
```

* `key`: `<String>` unique component identifier
* `post`: `<Post>` containing a Post object to be displayed
* `type`: `<String>` containing a type of comment, either *details* or *display*

#### Mapped props

```js
updatePost, deletePost, votePost, deleteComment, categories
```

#### Functions

* `toggleEditting()`: controls inline post editting
* `isEditting()`: return current editting state
* `getPostProps(id)`: checks for the existence of props that are used inside the render function
* `getValidCategories()`: returns a list of usable categories except the **all** category
* `handlePostUpdate(event)`
* `deletePost(post)`
* `upVotePost(id)`
* `downVotePost(id)`

### **PostDetails**

Same as Post component except for different layouts and a function that returns a readable date `getReadableDate()`. This component was created in order to simplify the Post component's JSX since it had way too many if clauses which, as a consequence, made it very difficult to read and maintain.

I am still thinking of a better approach since I am not following the reusability premise with such decision.

### **PostSubmit**

#### State

```js
state = {
  selectedCategory: "react",
}
```

* `selectedCategory`: `<String>` used to control the default selected category

#### Mapped props

```js
categories, updatePost, closeSubmitModal
```

#### Functions

* `initializeView()`: sets all default configuration in the view, layoutwise
* `getValidCategories()`: returns a list of usable categories except the **all** category
* `controlSelectedColor()`: controls buttons selected fx
* `selectCategory(categoryName)`: changes selectedCategory state according to what category is selected by the user
* `resetInputForm(event)`: reset post input form fields
* `handlePostUpload(event)`

## Reducers and Actions

Two reducers were developed for this application:

*post* & *comment*

Each of which responsible for maintaining states related to their corresponding kind.

The post reducer also controls state for categories and the post submittion modal.