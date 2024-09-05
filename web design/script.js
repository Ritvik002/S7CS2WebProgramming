document.getElementById('spoilerText').addEventListener('click', function() {
    this.classList.toggle('revealed');
});

function openModal() {
    const modal = 
        document.getElementById('myModal');
    const modalImg = 
        document.getElementById('modalImg');
    modal.style.display = 'block';
    modalImg.src = 'prof.png';
}

function closeModal() {
    const modal = 
        document.getElementById('myModal');
    modal.style.display = 'none';
}