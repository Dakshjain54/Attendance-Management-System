// Student Portal JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Get student ID from localStorage
    const studentId = localStorage.getItem('studentId');
    if (!studentId) {
        window.location.href = 'index.html';
        return;
    }

    // Get student data (in a real app, this would come from backend)
    const students = JSON.parse(localStorage.getItem('students')) || [];
    const student = students.find(s => s.id === studentId) || {
        id: studentId,
        name: 'Unknown Student',
        class: 'N/A',
        // email: 'N/A',
        subjects: [],
        attendance: {}
    };

    // Display student profile
    document.getElementById('student-name').textContent = student.name;
    document.getElementById('student-id').textContent = student.id;
    document.getElementById('student-class').textContent = student.class;
    // document.getElementById('student-email').textContent = student.email;

    // Calculate and display overall attendance
    function updateOverallAttendance() {
        let totalPresent = 0;
        let totalClasses = 0;
        
        for (const subject in student.attendance) {
            totalPresent += student.attendance[subject].present || 0;
            totalClasses += student.attendance[subject].total || 0;
        }
        
        const percentage = totalClasses > 0 ? Math.round((totalPresent / totalClasses) * 100) : 0;
        
        // Update progress circle
        const progressCircle = document.querySelector('.progress-circle-fill');
        if (progressCircle) {
            progressCircle.setAttribute('stroke-dasharray', `${percentage}, 100`);
        }
        
        // Update percentage text
        const percentageText = document.querySelector('.progress-circle-text');
        if (percentageText) {
            percentageText.textContent = `${percentage}%`;
        }
        
        return { percentage, totalPresent, totalClasses };
    }

    // Display subject-wise attendance
    function displaySubjectAttendance() {
        const subjectCards = document.getElementById('subject-cards');
        subjectCards.innerHTML = '';
        
        student.subjects.forEach(subject => {
            const attendance = student.attendance[subject] || { present: 0, total: 0 };
            const percentage = attendance.total > 0 ? 
                Math.round((attendance.present / attendance.total) * 100) : 0;
            
            const card = document.createElement('div');
            card.className = 'subject-card';
            card.innerHTML = `
                <h4>${subject.charAt(0).toUpperCase() + subject.slice(1)}</h4>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <p>${attendance.present}/${attendance.total} classes (${percentage}%)</p>
            `;
            subjectCards.appendChild(card);
        });
    }

    // Display attendance history
    function displayAttendanceHistory() {
        // In a real app, this would come from backend
        // For this demo, we'll generate sample history
        const history = [];
        const subjects = student.subjects;
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        
        subjects.forEach(subject => {
            const attendance = student.attendance[subject] || { present: 0, total: 0 };
            
            for (let i = 0; i < attendance.total; i++) {
                const isPresent = i < attendance.present;
                const randomDay = Math.floor(Math.random() * 28) + 1;
                const randomMonth = months[Math.floor(Math.random() * months.length)];
                
                history.push({
                    date: `${randomDay} ${randomMonth}`,
                    subject: subject.charAt(0).toUpperCase() + subject.slice(1),
                    status: isPresent ? 'Present' : 'Absent'
                });
            }
        });
        
        // Sort by date (simple sort for demo)
        // history.sort((a, b) => {
        //     const monthsOrder = { Jan: 1, Feb: 2, Mar: 3, Apr: 4, May: 5 };
        //     return monthsOrder[b.date.split(' ')[1]] - monthsOrder[a.date.split(' ')[1]] || 
        //            parseInt(b.date.split(' ')[0]) - parseInt(a.date.split(' ')[0]);
        // });
        
        // Display in table
        const tbody = document.querySelector('#attendance-history-table');
        tbody.innerHTML = '';
        
        history.forEach(record => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${record.date}</td>
                <td>${record.subject}</td>
                <td class="status ${record.status.toLowerCase()}">${record.status}</td>
            `;
            tbody.appendChild(row);
        });
    }

    // Initialize the page
    updateOverallAttendance();
    displaySubjectAttendance();
    displayAttendanceHistory();
});