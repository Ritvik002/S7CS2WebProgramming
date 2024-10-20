document.addEventListener('DOMContentLoaded', function() {
    const availableTagsContainer = document.getElementById('availableTagsContainer');
    const tagInput = document.getElementById('tagInput');
    const addTagBtn = document.getElementById('addTagBtn');
    const tagContainer = document.getElementById('tagContainer');
    const bookContainer = document.getElementById('bookContainer');
    
    let selectedTags = [];
    let availableTags = [];

    // Fetch available tags from the server
    fetch('get_tags.php')
        .then(response => response.json())
        .then(tags => {
            availableTags = tags;
            tags.forEach(tag => {
                const tagElement = document.createElement('span');
                tagElement.className = 'available-tag';
                tagElement.textContent = tag.name;
                
                tagElement.addEventListener('click', function() {
                    const tagName = tag.name.toLowerCase();
                    if (!selectedTags.includes(tagName)) {
                        selectedTags.push(tagName);
                        renderTags();
                        fetchBooks();
                    }
                });
                
                availableTagsContainer.appendChild(tagElement);
            });
        })
        .catch(error => {
            console.error('Error fetching tags:', error);
            availableTagsContainer.innerHTML = 'Error loading tags';
        });

    addTagBtn.addEventListener('click', addTag);
    tagInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTag();
    });

    function addTag() {
        const tag = tagInput.value.trim().toLowerCase();
        const tagExists = availableTags.some(t => t.name.toLowerCase() === tag);
        
        if (tag && !selectedTags.includes(tag) && tagExists) {
            selectedTags.push(tag);
            renderTags();
            tagInput.value = '';
            fetchBooks();
        } else if (!tagExists) {
            alert('This tag is not available. Please select from the available tags.');
        }
    }

    function renderTags() {
        tagContainer.innerHTML = '';
        selectedTags.forEach(tag => {
            const tagElement = document.createElement('span');
            tagElement.classList.add('tag', 'selected');
            tagElement.textContent = tag;
            const removeBtn = document.createElement('span');
            removeBtn.classList.add('remove');
            removeBtn.textContent = '×';
            removeBtn.onclick = () => removeTag(tag);
            tagElement.appendChild(removeBtn);
            tagContainer.appendChild(tagElement);
        });
    }

    function removeTag(tag) {
        selectedTags = selectedTags.filter(t => t !== tag);
        renderTags();
        fetchsBooks();
    }

    function fetchBooks() {
        if (selectedTags.length > 0) {
            fetch('get_books.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: `tags=${encodeURIComponent(JSON.stringify(selectedTags))}`
            })
            .then(response => response.json())
            .then(books => {
                console.log('Received books:', books); // Debug log
                renderBooks(books);
            })
            .catch(error => {
                console.error('Error:', error);
                bookContainer.innerHTML = '<div class="error">Error loading books</div>';
            });
        } else {
            bookContainer.innerHTML = '';
        }
    }

    function renderBooks(books) {
        bookContainer.innerHTML = '';
        if (!Array.isArray(books)) {
            console.error('Expected books to be an array, got:', books);
            return;
        }

        books.forEach(book => {
            console.log('Processing book:', book); // Debug log
            const bookCard = document.createElement('div');
            bookCard.classList.add('book-card');
            
            // Ensure book.tags is an array, if not, make it an empty array
            const tags = Array.isArray(book.tags) ? book.tags : [];
            const bookTags = tags.map(tag => `<span class="book-tag">${tag}</span>`).join('');
    
            bookCard.innerHTML = `
                <img src="${book.image}" onerror="this.src='https://via.placeholder.com/250x200.png?text=${encodeURIComponent(book.title)}'">
                <div class="book-info">
                    <h3 class="book-title">${book.title}</h3>
                    <p class="book-year">${book.year}</p>
                    <p class="book-rating">★ ${book.rating.toFixed(1)}</p>
                    <div class="book-tags">
                        ${bookTags}
                    </div>
                </div>
            `;
            
            bookContainer.appendChild(bookCard);
        });
    }
});