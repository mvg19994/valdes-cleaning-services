/*
 * reviews.js
 *
 * This script provides client‑side functionality for capturing
 * customer reviews, persisting them in localStorage and displaying
 * them on the testimonials pages. It also allows the company to
 * respond to individual testimonials. Because this is a static
 * website with no backend, all data is stored locally in the
 * visitor's browser. In a production deployment you would likely
 * replace this with a proper database or backend service.
 */

// Retrieve the current list of stored reviews from localStorage.
function getReviews() {
    const stored = localStorage.getItem('reviews');
    try {
        return stored ? JSON.parse(stored) : [];
    } catch (err) {
        console.error('Error parsing stored reviews', err);
        return [];
    }
}

// Persist an updated list of reviews to localStorage.
function saveReviews(reviews) {
    localStorage.setItem('reviews', JSON.stringify(reviews));
}

// Handle submission of a review form.
// Captures the star rating and comment, stores the new review
// and redirects to the appropriate testimonials page.
function submitReview(event) {
    event.preventDefault();
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    const commentInput = document.getElementById('comment');
    if (!ratingInput || !commentInput) return;
    const rating = parseInt(ratingInput.value, 10);
    const comment = commentInput.value.trim();
    if (!comment) return;
    const date = new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    const reviews = getReviews();
    reviews.push({ rating, comment, reply: '', date });
    saveReviews(reviews);
    // Determine the language based on the html lang attribute.
    const lang = document.documentElement.lang;
    // Redirect to the testimonials page after saving.
    if (lang === 'es') {
        window.location.href = 'testimonios.html';
    } else {
        window.location.href = 'testimonials_en.html';
    }
}

// Display stored reviews on the testimonials page. If there is an
// element with id="dynamic-reviews" it will be populated with
// testimonials saved in localStorage. Each testimonial shows the
// star rating, comment, date and any company reply. The company
// can add a reply by clicking the reply button next to each review.
function displayReviews() {
    const container = document.getElementById('dynamic-reviews');
    if (!container) return;
    const lang = document.documentElement.lang;
    const reviews = getReviews();
    // Clear any existing dynamic content before repopulating.
    container.innerHTML = '';
    reviews.forEach((review, index) => {
        const article = document.createElement('article');
        article.className = 'testimonial';
        // Build star icons using unicode stars for simplicity. You could
        // replace this with inline SVGs or other graphics if desired.
        const filledStars = '★'.repeat(review.rating);
        const emptyStars = '☆'.repeat(5 - review.rating);
        // Create rating element
        const ratingDiv = document.createElement('div');
        ratingDiv.className = 'rating';
        ratingDiv.textContent = filledStars + emptyStars;
        // Create blockquote for comment
        const blockquote = document.createElement('blockquote');
        blockquote.textContent = review.comment;
        // Create cite for date (we use date instead of author name)
        const cite = document.createElement('cite');
        cite.textContent = review.date;
        // Create reply container
        const replyDiv = document.createElement('div');
        replyDiv.className = 'reply';
        if (review.reply) {
            const strong = document.createElement('strong');
            strong.textContent = lang === 'es' ? 'Respuesta: ' : 'Reply: ';
            replyDiv.appendChild(strong);
            replyDiv.appendChild(document.createTextNode(review.reply));
        }
        // Create reply button
        const replyBtn = document.createElement('button');
        replyBtn.className = 'reply-btn';
        replyBtn.setAttribute('data-index', index);
        replyBtn.textContent = lang === 'es' ? 'Responder' : 'Reply';
        // Append elements to article
        article.appendChild(ratingDiv);
        article.appendChild(blockquote);
        article.appendChild(cite);
        article.appendChild(replyDiv);
        article.appendChild(replyBtn);
        container.appendChild(article);
    });
    // Event delegation for handling replies
    container.addEventListener('click', (e) => {
        const target = e.target;
        if (target.classList.contains('reply-btn')) {
            const idx = parseInt(target.getAttribute('data-index'), 10);
            const reviews = getReviews();
            const promptMsg = lang === 'es' ? 'Escribe tu respuesta:' : 'Enter your reply:';
            const response = window.prompt(promptMsg, reviews[idx].reply || '');
            if (response !== null) {
                reviews[idx].reply = response.trim();
                saveReviews(reviews);
                // Refresh display to show updated reply
                displayReviews();
            }
        }
    });
}

// When the DOM is ready, initialise any testimonials list on the page.
document.addEventListener('DOMContentLoaded', () => {
    displayReviews();
});