// Teacher Portal JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Sample data (in a real app, this would come from backend)
    let students = JSON.parse(localStorage.getItem('students')) || [
        // {
        //     id: '1001',
        //     name: 'Rahul Sharma',
        //     class: '10',
        //     email: 'rahul.sharma@college.edu',
        //     subjects: ['math', 'science', 'DAALab'],
        //     attendance: {
        //         math: { present: 18, total: 20 },
        //         science: { present: 17, total: 20 },
        //         DAALab: { present: 19, total: 20 }
        //     }
        // },
        // {
        //     id: '1002',
        //     name: 'Priya Patel',
        //     class: '10',
        //     email: 'priya.patel@college.edu',
        //     subjects: ['math', 'science', 'history'],
        //     attendance: {
        //         math: { present: 20, total: 20 },
        //         science: { present: 18, total: 20 },
        //         history: { present: 15, total: 20 }
        //     }
        // },
        // {
        //     id: '1003',
        //     name: 'Amit Singh',
        //     class: '11',
        //     email: 'amit.singh@college.edu',
        //     subjects: ['math', 'DAALab', 'history'],
        //     attendance: {
        //         math: { present: 16, total: 20 },
        //         DAALab: { present: 18, total: 20 },
        //         history: { present: 14, total: 20 }
        //     }
        // }
    ];
    
    const studentSearch = document.getElementById('student-search');
    studentSearch.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const rows = document.querySelectorAll('#students-table tr');
        
        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            let shouldShow = false;
            
            // Check each cell in the row (except the last one with actions)
            for (let i = 0; i < cells.length - 1; i++) {
                if (cells[i].textContent.toLowerCase().includes(searchTerm)) {
                    shouldShow = true;
                    break;
                }
            }
            
            row.style.display = shouldShow ? '' : 'none';
        });
    });

    // Save students to localStorage
    // In teacher.js - when saving attendance
function saveAttendance() {
    const selectedClass = document.getElementById('attendance-class').value;
    const selectedSubject = document.getElementById('attendance-subject').value;
    const selectedDate = document.getElementById('attendance-date').value;
    
    // Get existing records or initialize
    let attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    
    // Remove any existing records for this class/subject/date
    attendanceRecords = attendanceRecords.filter(record => 
        !(record.class === selectedClass && 
          record.subject === selectedSubject &&
          record.date === selectedDate)
    );
    
    // Add new records
    document.querySelectorAll('.attendance-status').forEach(select => {
        const studentId = select.getAttribute('data-id');
        const present = select.value === 'present';
        
        attendanceRecords.push({
            studentId,
            class: selectedClass,
            subject: selectedSubject,
            date: selectedDate,
            present
        });
    });
    
    // Save to localStorage
    localStorage.setItem('attendanceRecords', JSON.stringify(attendanceRecords));
    
    // Update student attendance counts
    updateStudentAttendanceCounts(selectedClass, selectedSubject, selectedDate);
    
    alert('Attendance saved successfully!');
}

function updateStudentAttendanceCounts(classCode, subject, date) {
    let students = JSON.parse(localStorage.getItem('students')) || [];
    
    // Get all records for this class/subject/date
    const attendanceRecords = JSON.parse(localStorage.getItem('attendanceRecords')) || [];
    const todaysRecords = attendanceRecords.filter(record => 
        record.class === classCode && 
        record.subject === subject &&
        record.date === date
    );
    
    // Update each student's attendance count
    students = students.map(student => {
        // Only update students in this class
        if (student.class !== classCode) return student;
        
        // Initialize attendance object if needed
        if (!student.attendance) student.attendance = {};
        if (!student.attendance[subject]) {
            student.attendance[subject] = { present: 0, total: 0 };
        }
        
        // Find this student's record
        const record = todaysRecords.find(r => r.studentId === student.id);
        
        if (record) {
            // Update counts
            student.attendance[subject].total += 1;
            if (record.present) {
                student.attendance[subject].present += 1;
            }
        }
        
        return student;
    });
    
    localStorage.setItem('students', JSON.stringify(students));
}
    // Navigation tabs
    const navButtons = document.querySelectorAll('.nav-btn');
    const contentSections = document.querySelectorAll('.content-section');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding content section
            contentSections.forEach(section => section.classList.remove('active'));
            document.getElementById(target).classList.add('active');
        });
    });

    // Load students table
function setupDeleteButtons() {
    const deleteButtons = document.querySelectorAll('.delete-btn');
    
    deleteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const studentId = this.getAttribute('data-id');
            
            // Confirm before deleting
            if (confirm(`Are you sure you want to delete student ${studentId}?`)) {
                // Find index of student to delete
                const studentIndex = students.findIndex(s => s.id === studentId);
                
                if (studentIndex !== -1) {
                    // Remove student from array
                    students.splice(studentIndex, 1);
                    
                    // Update localStorage
                    localStorage.setItem('students', JSON.stringify(students));
                    
                    // Reload the table
                    loadStudentsTable();
                    
                    // Show success message
                    alert('Student deleted successfully!');
                }
            }
        });
    });
}
function setupEditButtons() {
    const editButtons = document.querySelectorAll('.edit-btn');
    
    editButtons.forEach(button => {
        button.addEventListener('click', function() {
            const studentId = this.getAttribute('data-id');
            const student = students.find(s => s.id === studentId);
            
            if (student) {
                // Fill the form with student data
                document.getElementById('student-id').value = student.id;
                document.getElementById('student-name').value = student.name;
                document.getElementById('student-class').value = student.class;
                // document.getElementById('student-email').value = student.email;
                
                // Clear all checkboxes first
                document.querySelectorAll('input[name="subjects"]').forEach(checkbox => {
                    checkbox.checked = false;
                });
                
                // Check the subjects the student is enrolled in
                student.subjects.forEach(subject => {
                    const checkbox = document.querySelector(`input[name="subjects"][value="${subject}"]`);
                    if (checkbox) checkbox.checked = true;
                });
                
                // Change the form title and submit button text
                document.querySelector('#add-student-modal h2').textContent = 'Edit Student';
                document.querySelector('#student-form button[type="submit"]').textContent = 'Update Student';
                
                // Store the student ID being edited in a data attribute
                document.getElementById('student-form').setAttribute('data-edit-id', studentId);
                
                // Open the modal
                document.getElementById('add-student-modal').style.display = 'block';
            }
        });
    });
}


// Then modify the loadStudentsTable() function to call setupDeleteButtons():
function loadStudentsTable() {
    const tbody = document.querySelector('#students-table');
    tbody.innerHTML = '';
    
    students.forEach(student => {
        // Calculate overall attendance percentage
        let totalPresent = 0;
        let totalClasses = 0;
        
        for (const subject in student.attendance) {
            totalPresent += student.attendance[subject].present;
            totalClasses += student.attendance[subject].total;
        }
        
        const overallPercentage = totalClasses > 0 ? 
            Math.round((totalPresent / totalClasses) * 100) : 0;
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>Class ${student.class}</td>
            <td>${student.subjects.join(', ')}</td>
            <td>${overallPercentage}%</td>
            <td>
                <button class="btn btn-primary edit-btn" data-id="${student.id}">Edit</button>
                <button class="btn btn-danger delete-btn" data-id="${student.id}">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
    });
    
    // Update dashboard stats
    document.getElementById('total-students').textContent = students.length;
    
    // Setup delete button event listeners
    setupDeleteButtons();
    setupEditButtons();
}

const studentForm = document.getElementById('student-form');
studentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const id = document.getElementById('student-id').value;
    const name = document.getElementById('student-name').value;
    const studentClass = document.getElementById('student-class').value;
    // const email = document.getElementById('student-email').value;
    
    // Get selected subjects
    const subjectCheckboxes = document.querySelectorAll('input[name="subjects"]:checked');
    const subjects = Array.from(subjectCheckboxes).map(cb => cb.value);
    
    // Check if we're editing an existing student
    const editId = this.getAttribute('data-edit-id');
    if (editId) {
        // Find the existing student
        const studentIndex = students.findIndex(s => s.id === editId);
        if (studentIndex !== -1) {
            // Update the existing student
            students[studentIndex] = {
                ...students[studentIndex], // Keep existing properties
                id, // Update ID if changed
                name,
                class: studentClass,
                // email,
                subjects
            };
            
            // Initialize attendance for any new subjects
            subjects.forEach(subject => {
                if (!students[studentIndex].attendance[subject]) {
                    students[studentIndex].attendance[subject] = { present: 0, total: 0 };
                }
            });
            
            // Remove attendance for subjects that were deselected
            Object.keys(students[studentIndex].attendance).forEach(subject => {
                if (!subjects.includes(subject)) {
                    delete students[studentIndex].attendance[subject];
                }
            });
        }
    } else {
        // Create new student object
        const newStudent = {
            id,
            name,
            class: studentClass,
            // email,
            subjects,
            attendance: {}
        };
        
        // Initialize attendance for each subject
        subjects.forEach(subject => {
            newStudent.attendance[subject] = { present: 0, total: 0 };
        });
        
        students.push(newStudent);
    }
    
    // Save to localStorage
    localStorage.setItem('students', JSON.stringify(students));
    
    // Reload table and close modal
    loadStudentsTable();
    document.getElementById('add-student-modal').style.display = 'none';
    
    // Reset form and remove edit mode
    studentForm.reset();
    studentForm.removeAttribute('data-edit-id');
    document.querySelector('#add-student-modal h2').textContent = 'Add New Student';
    document.querySelector('#student-form button[type="submit"]').textContent = 'Add Student';
});
    // Mark attendance functionality
    const loadStudentsBtn = document.getElementById('load-students');
    const saveAttendanceBtn = document.getElementById('save-attendance');
    
    loadStudentsBtn.addEventListener('click', function() {
        const selectedClass = document.getElementById('attendance-class').value;
        const selectedSubject = document.getElementById('attendance-subject').value;
        const selectedDate = document.getElementById('attendance-date').value;
        
        if (!selectedClass || !selectedSubject || !selectedDate) {
            alert('Please select class, subject and date');
            return;
        }
        
        // Filter students by class
        const classStudents = students.filter(student => student.class === selectedClass);
        
        // Update attendance sheet title
        document.getElementById('attendance-sheet-title').textContent = 
            `Class ${selectedClass} - ${selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} - ${selectedDate}`;
        
        // Load attendance table
        const tbody = document.querySelector('#attendance-table');
        tbody.innerHTML = '';
        
        classStudents.forEach(student => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${student.id}</td>
                <td>${student.name}</td>
                <td>
                    <select class="attendance-status" data-id="${student.id}">
                        <option value="present">Present</option>
                        <option value="absent">Absent</option>
                    </select>
                </td>
            `;
            tbody.appendChild(row);
        });
        
        document.getElementById('attendance-sheet').classList.remove('hidden');
    });
    
    saveAttendanceBtn.addEventListener('click', function() {
        const selectedSubject = document.getElementById('attendance-subject').value;
        const selectedDate = document.getElementById('attendance-date').value;
        
        const statusSelects = document.querySelectorAll('.attendance-status');
        
        statusSelects.forEach(select => {
            const studentId = select.getAttribute('data-id');
            const status = select.value;
            
            // Find student and update attendance
            const student = students.find(s => s.id === studentId);
            if (student && student.attendance[selectedSubject]) {
                student.attendance[selectedSubject].total += 1;
                if (status === 'present') {
                    student.attendance[selectedSubject].present += 1;
                }
            }
        });
        
        localStorage.setItem('students', JSON.stringify(students));
        alert('Attendance saved successfully!');
        document.getElementById('attendance-sheet').classList.add('hidden');
    });

    // Export to Excel
    document.getElementById('export-excel').addEventListener('click', function() {
        // Get selected filters
        const selectedClass = document.getElementById('report-class').value;
        const selectedSubject = document.getElementById('report-subject').value;
        
        try {
            // Filter students based on selections
            let filteredStudents = [...students];
            if (selectedClass) {
                filteredStudents = filteredStudents.filter(student => student.class === selectedClass);
            }
    
            // Check if there are students to export
            if (filteredStudents.length === 0) {
                alert('No student data available for the selected filters');
                return;
            }
    
            // Prepare the data for export
            const exportData = filteredStudents.map(student => {
                const row = {
                    'Student ID': student.id,
                    'Name': student.name,
                    'Class': ` ${student.class}`
                };
    
                if (selectedSubject) {
                    // Export only the selected subject
                    const attendance = student.attendance[selectedSubject] || { present: 0, total: 0 };
                    const percentage = attendance.total > 0 ? 
                        Math.round((attendance.present / attendance.total) * 100) : 0;
                    
                    row['Subject'] = selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1);
                    row['Present'] = attendance.present;
                    row['Absent'] = attendance.total - attendance.present;
                    row['Total Classes'] = attendance.total;
                    row['Attendance %'] = percentage;
                } else {
                    // Export all subjects
                    student.subjects.forEach(subject => {
                        const attendance = student.attendance[subject] || { present: 0, total: 0 };
                        const percentage = attendance.total > 0 ? 
                            Math.round((attendance.present / attendance.total) * 100) : 0;
                        
                        row[subject.charAt(0).toUpperCase() + subject.slice(1)] = 
                            `${attendance.present}/${attendance.total} (${percentage}%)`;
                    });
                }
    
                return row;
            });
    
            // Create worksheet
            const worksheet = XLSX.utils.json_to_sheet(exportData);
            
            // Set column widths
            const wscols = [
                {wch: 10}, // Student ID
                {wch: 20}, // Name
                {wch: 8},  // Class
            ];
            
            if (selectedSubject) {
                wscols.push(
                    {wch: 15}, // Subject
                    {wch: 10}, // Present
                    {wch: 10}, // Absent
                    {wch: 12}, // Total Classes
                    {wch: 12}  // Attendance %
                );
            } else {
                // Dynamically add widths for subjects
                const subjects = [...new Set(students.flatMap(s => s.subjects))];
                subjects.forEach(() => wscols.push({wch: 20}));
            }
            
            worksheet['!cols'] = wscols;
    
            // Create workbook
            const workbook = XLSX.utils.book_new();
            
            // Generate filename based on filters
            let filename = 'attendance_report';
            if (selectedClass) filename += `_${selectedClass}`;
            if (selectedSubject) filename += `_${selectedSubject}`;
            filename += `_${new Date().toISOString().slice(0,10)}.xlsx`;
            
            // Add worksheet to workbook
            XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
            
            // Generate Excel file and trigger download
            XLSX.writeFile(workbook, filename, { compression: true });
    
        } catch (error) {
            console.error('Error exporting to Excel:', error);
            alert('Failed to export to Excel. Please try again.');
        }
    });
    
// Generate reports
document.getElementById('generate-report').addEventListener('click', function() {
    const selectedClass = document.getElementById('report-class').value;
    const selectedSubject = document.getElementById('report-subject').value;
    
    // Filter students
    let filteredStudents = [...students];
    if (selectedClass) {
        filteredStudents = filteredStudents.filter(student => student.class === selectedClass);
    }
    
    // Prepare data for chart and table
    const chartData = {
        labels: [],
        present: [],
        absent: []
    };
    
    const table = document.querySelector('#report-table');
    table.innerHTML = `
        <thead>
            <tr>
                <th>Student ID</th>
                <th>Name</th>
                <th>Class</th>
                ${selectedSubject ? 
                    `<th>${selectedSubject.charAt(0).toUpperCase() + selectedSubject.slice(1)} Attendance</th>` : 
                    '<th>DM</th><th>COA</th><th>OS</th><th>IML</th><th>CN</th><th>DAA</th><th>DAALab</th><th>OSLab</th><th>CNLab</th><th>IMLLab</th><th>DT</th><th>UHB</th>'
                }
            </tr>
        </thead>
        <tbody>
        </tbody>
    `;
    
    const tbody = table.querySelector('tbody');
    
    filteredStudents.forEach(student => {
        chartData.labels.push(student.name);
        
        if (selectedSubject) {
            const attendance = student.attendance[selectedSubject] || { present: 0, total: 0 };
            const absent = attendance.total - attendance.present;
            
            chartData.present.push(attendance.present);
            chartData.absent.push(absent);
            
            const percentage = attendance.total > 0 ? 
                Math.round((attendance.present / attendance.total) * 100) : 0;
            
            tbody.innerHTML += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>Class ${student.class}</td>
                    <td>${attendance.present}/${attendance.total} (${percentage}%)</td>
                </tr>
            `;
        } else {
            // Show all subjects if no specific subject selected
            tbody.innerHTML += `
                <tr>
                    <td>${student.id}</td>
                    <td>${student.name}</td>
                    <td>Class ${student.class}</td>
                    <td>${student.subjects.includes('DM') ? 
                        `${student.attendance.DM?.present || 0}/${student.attendance.DM?.total || 0}` : ''}</td>
                    <td>${student.subjects.includes('COA') ? 
                        `${student.attendance.COA?.present || 0}/${student.attendance.COA?.total || 0}` : ''}</td>
                    <td>${student.subjects.includes('OS') ? 
                        `${student.attendance.OS?.present || 0}/${student.attendance.OS?.total || 0}` : ''}</td>
                    <td>${student.subjects.includes('IML') ? 
                        `${student.attendance.IML?.present || 0}/${student.attendance.IML?.total || 0}` : ''}</td>
                    <td>${student.subjects.includes('CN') ? 
                        `${student.attendance.CN?.present || 0}/${student.attendance.CN?.total || 0}` : ''}</td>
                    <td>${student.subjects.includes('DAA') ? 
                        `${student.attendance.DAA?.present || 0}/${student.attendance.DAA?.total || 0}` : ''}</td>
                    <td>${student.subjects.includes('DAALab') ? 
                        `${student.attendance.DAALab?.present || 0}/${student.attendance.DAALab?.total || 0}` : ''}</td>
                    <td>${student.subjects.includes('OSLab') ? 
                        `${student.attendance.OSLab?.present || 0}/${student.attendance.OSLab?.total || 0}` : ''}</td>
                    <td>${student.subjects.includes('CNLab') ? 
                        `${student.attendance.CNLab?.present || 0}/${student.attendance.CNLab?.total || 0}` : ''}</td>
                    <td>${student.subjects.includes('IMLLab') ? 
                        `${student.attendance.IMLLab?.present || 0}/${student.attendance.IMLLab?.total || 0}` : ''}</td>
                    <td>${student.subjects.includes('DT') ? 
                        `${student.attendance.DT?.present || 0}/${student.attendance.DT?.total || 0}` : ''}</td>
                    <td>${student.subjects.includes('UHB') ? 
                        `${student.attendance.UHB?.present || 0}/${student.attendance.UHB?.total || 0}` : ''}</td>
                </tr>
            `;
        }
    });
    
    // Update chart
    if (selectedSubject) {
        const ctx = document.getElementById('attendance-chart').getContext('2d');
        
        if (window.attendanceChart) {
            window.attendanceChart.destroy();
        }
        
        window.attendanceChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [
                    {
                        label: 'Present',
                        data: chartData.present,
                        backgroundColor: '#2ecc71'
                    },
                    {
                        label: 'Absent',
                        data: chartData.absent,
                        backgroundColor: '#e74c3c'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        stacked: true
                    },
                    y: {
                        stacked: true,
                        beginAtZero: true
                    }
                }
            }
        });
    }
});

// Initialize the page
loadStudentsTable();
});