// ************************** Book Constructor **************************
function Book(title, author, isbn) {
    this.title = title;
    this.author = author;
    this.isbn = isbn;
};

// ************************** UI Constructor **************************
function UI() {}

// Add book to list
UI.prototype.addBookToList = function (book) {
    const list = document.getElementById('book-list');
    
    // Create tr element
    const row = document.createElement('tr');

    // Insert cols 
    row.innerHTML = `
        <td>${book.title}</td>
        <td>${book.author}</td>
        <td>${book.isbn}</td>
        <td><a href="#" class="delete">X</a></td>
    `;

    list.appendChild(row);
}

// Show Alert
UI.prototype.showAlert = function (message, className) {
    // Create div
    const div = document.createElement('div');
    // Add classes 
    div.className = `alert ${className}`;
    // Add text
    div.appendChild(document.createTextNode(message));
    // Get parent
    const container = document.querySelector('.container');
    const form = document.querySelector('#book-form');
    // Insert Alert
    container.insertBefore(div, form); // what we wanna insert and second argument what we want to insert before

    // Timeout after 3 sec
    setTimeout(function(){
        document.querySelector('.alert'). remove();
    }, 3000)
}

// Delete Book
UI.prototype.deleteBook = function(target) {
    if(target.className === 'delete') {
        target.parentElement.parentElement.remove(); // event delegation
    }
}

UI.prototype.clearFields = function() {
    // Clearing fields
    document.getElementById('title').value = '',
    document.getElementById('author').value = '',
    document.getElementById('isbn').value = '';
}

// ************************** STORAGE Constructor **************************

function Store() {}

Store.prototype.getBooks = function () {
    let books;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
}

Store.prototype.displayBooks = function () {
    const books = Store.prototype.getBooks();

        books.forEach(function(book) {
            const ui = new UI;

            ui.addBookToList(book);
        });
}

Store.prototype.addBook = function (book) {
    const books = Store.prototype.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
}

Store.prototype.removeBook = function (isbn) {
    const books = Store.prototype.getBooks();

        books.forEach(function(book, index) {
            if(book.isbn === isbn) {
                books.splice(index ,1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
}

// DOM Load Event 
document.addEventListener('DOMContentLoaded', Store.prototype.displayBooks);

// Event Listeners for add book
document.getElementById('book-form').addEventListener('submit', function(e) {
    // Get form values from the UI
    const title = document.getElementById('title').value,
          author = document.getElementById('author').value,
          isbn = document.getElementById('isbn').value;

    // Instantiate the book      
    const book = new Book(title, author, isbn);

    // Instantiate UI
    const ui = new UI();

    // Instantiate Store
    const store = new Store()

    // Validate
    if(title === '' || author === '' || isbn === '' ) {
        // Error alert 
        ui.showAlert('Please fill in all fields' , 'error')
    } else {
        // Add book to list
        ui.addBookToList(book);

        // Add book to Local Storage
        store.addBook(book)

        // Show success 
        ui.showAlert('Book Added!' , 'success ');

        // Clear Fields
        ui.clearFields();
    }

    e.preventDefault();
})

// Event Listener for delete book
document.getElementById('book-list').addEventListener('click', function(e) {
    // Instantiate UI
    const ui = new UI();

    // Delete Book
    ui.deleteBook(e.target);

    // Remove book from Local Storage
    Store.prototype.removeBook(e.target.parentElement.previousElementSibling.textContent);
    // console.log(e.target.parentElement.previousElementSibling.textContent);

    // Show message 
    ui.showAlert('Book Removed!',  'success');

    e.preventDefault();
});

