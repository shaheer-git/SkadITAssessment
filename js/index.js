AOS.init();
tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#161c28',
                accent: '#BDF645',
                secondary: '#fefef4'
            }
        }
    }
}
const switchBtns = document.querySelectorAll('.learn-more');
const closeTable = document.querySelector('#dimbg');
const viewTable = document.querySelector('#view-table');

switchBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        let jobFormContainer = document.querySelector('#job-application-root');
        let contactFormContainer = document.querySelector('#contact-root');
        btn.children[0].classList.add('w-full');
        btn.children[1].classList.add('text-primary');
        if (btn.previousElementSibling !== null) {
            btn.previousElementSibling.children[0].classList.remove('w-full');
            btn.previousElementSibling.children[1].classList.remove('text-primary');
        } else {
            btn.nextElementSibling.children[0].classList.remove('w-full');
            btn.nextElementSibling.children[1].classList.remove('text-primary');
        }
        if (btn.textContent.trim().toLocaleLowerCase() === 'contact') {
            jobFormContainer.classList.add('hidden');
            contactFormContainer.classList.remove('hidden');
        } else {
            contactFormContainer.classList.add('hidden');
            jobFormContainer.classList.remove('hidden');
        }
    });
})

closeTable.addEventListener('click', () => {
    document.querySelector('#application-table-root').classList.add('hidden');
    document.querySelector('#dimbg').classList.add('hidden');
});

viewTable.addEventListener('click', () => {
    document.querySelector('#application-table-root').classList.remove('hidden');
    document.querySelector('#dimbg').classList.remove('hidden');
});