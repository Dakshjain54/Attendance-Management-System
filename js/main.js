// Common functions for all pages

// Fixed password values
const FIXED_TEACHER_PASSWORD = "teacher123";
const FIXED_STUDENT_PASSWORD = "student123";

document.addEventListener('DOMContentLoaded', function() {
    // Login page tab switching
    const teacherTab = document.getElementById('teacher-tab');
    const studentTab = document.getElementById('student-tab');
    const teacherLogin = document.getElementById('teacher-login');
    const studentLogin = document.getElementById('student-login');

    if (teacherTab && studentTab) {
        teacherTab.addEventListener('click', function() {
            teacherTab.classList.add('active');
            studentTab.classList.remove('active');
            teacherLogin.classList.add('active');
            studentLogin.classList.remove('active');
        });

        studentTab.addEventListener('click', function() {
            studentTab.classList.add('active');
            teacherTab.classList.remove('active');
            studentLogin.classList.add('active');
            teacherLogin.classList.remove('active');
        });
    }

    // Teacher login with fixed password
    if (teacherLogin) {
        teacherLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const password = document.getElementById('teacher-password').value;
            
            if (password === FIXED_TEACHER_PASSWORD) {
                localStorage.setItem('userType', 'teacher');
                window.location.href = 'teacher.html';
            } else {
                alert('Incorrect password. Please use the default password.');
            }
        });
    }

    // Student login with fixed password
    if (studentLogin) {
        studentLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            const studentId = document.getElementById('student-id').value;
            const password = document.getElementById('student-password').value;
            
            if (password === FIXED_STUDENT_PASSWORD) {
                localStorage.setItem('userType', 'student');
                localStorage.setItem('studentId', studentId);
                window.location.href = 'student.html';
            } else {
                alert('Incorrect password. Please use the default password.');
            }
        });
    }

    // Logout functionality
    const logoutButtons = document.querySelectorAll('#logout');
    logoutButtons.forEach(button => {
        button.addEventListener('click', function() {
            localStorage.clear();
            window.location.href = 'index.html';
        });
    });

    // Check authentication on teacher and student pages
    if (window.location.pathname.includes('teacher.html')) {
        if (localStorage.getItem('userType') !== 'teacher') {
            window.location.href = 'index.html';
        }
    }

    if (window.location.pathname.includes('student.html')) {
        if (localStorage.getItem('userType') !== 'student') {
            window.location.href = 'index.html';
        }
    }
});

// Modal functionality
function setupModal(modalId, openButtonId, closeButtonClass) {
    const modal = document.getElementById(modalId);
    if (!modal) return;

    // Open modal
    if (openButtonId) {
        const openButton = document.getElementById(openButtonId);
        if (openButton) {
            openButton.addEventListener('click', function() {
                modal.style.display = 'block';
            });
        }
    }

    // Close modal
    const closeButtons = document.querySelectorAll(`.${closeButtonClass}`);
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    });

    // Close when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Initialize all modals on page load
document.addEventListener('DOMContentLoaded', function() {
    setupModal('add-student-modal', 'add-student', 'close-modal');
});