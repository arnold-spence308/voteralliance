
const express = require('express');
const bcrypt = require('bcrypt');
const { Pool } = require('pg');

const router = express.Router();
const pool = new Pool({
    user: 'your_db_user',
    host: 'localhost',
    database: 'ravensm',
    password: 'your_db_password',
    port: 5432,
});

// Registration route
router.post('/register', async (req, res) => {
    const { name, month, day, year, email, phone, username, password } = req.body;

    try {
        // Hash the password for security
        const hashedPassword = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO users (name, dob, email, phone, username, password)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING id;
        `;

        const dob = `${year}-${month}-${day}`;
        const values = [name, dob, email, phone, username, hashedPassword];

        const result = await pool.query(query, values);

        if (result.rows.length > 0) {
            res.status(201).json({ message: 'User registered successfully!' });
        } else {
            res.status(400).json({ message: 'Registration failed.' });
        }
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;

// Populate days and years for DOB
        document.addEventListener('DOMContentLoaded', function() {
            // Populate days (1-31)
            const daySelect = document.getElementById('day');
            for (let i = 1; i <= 31; i++) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                daySelect.appendChild(option);
            }
            
            // Populate years (current year - 100 to current year - 13)
            const yearSelect = document.getElementById('year');
            const currentYear = new Date().getFullYear();
            for (let i = currentYear - 13; i >= currentYear - 100; i--) {
                const option = document.createElement('option');
                option.value = i;
                option.textContent = i;
                yearSelect.appendChild(option);
            }
            
            // Form navigation
            const steps = document.querySelectorAll('.form-step');
            const progressSteps = document.querySelectorAll('.progress-step');
            let currentStep = 0;
            
            function showStep(stepIndex) {
                steps.forEach((step, index) => {
                    step.classList.toggle('active', index === stepIndex);
                });
                
                progressSteps.forEach((step, index) => {
                    if (index < stepIndex) {
                        step.classList.add('completed');
                        step.classList.remove('active');
                    } else if (index === stepIndex) {
                        step.classList.add('active');
                        step.classList.remove('completed');
                    } else {
                        step.classList.remove('active', 'completed');
                    }
                });
                
                currentStep = stepIndex;
            }
            
            // Next/Back buttons
            document.getElementById('next1').addEventListener('click', function() {
                if (validateStep1()) {
                    showStep(1);
                }
            });
            
            document.getElementById('next2').addEventListener('click', function() {
                if (validateStep2()) {
                    showStep(2);
                }
            });
            
            document.getElementById('next3').addEventListener('click', function() {
                if (validateStep3()) {
                    showStep(3);
                }
            });
            
            document.getElementById('back2').addEventListener('click', function() {
                showStep(0);
            });
            
            document.getElementById('back3').addEventListener('click', function() {
                showStep(1);
            });
            
            document.getElementById('back4').addEventListener('click', function() {
                showStep(2);
            });
            
            // Form validation functions
            function validateStep1() {
                let isValid = true;
                const name = document.getElementById('name').value.trim();
                const month = document.getElementById('month').value;
                const day = document.getElementById('day').value;
                const year = document.getElementById('year').value;
                
                if (name.length < 2) {
                    document.getElementById('name-error').textContent = 'Please enter a valid name';
                    document.getElementById('name-error').style.display = 'block';
                    isValid = false;
                } else {
                    document.getElementById('name-error').style.display = 'none';
                }
                
                if (!month || !day || !year) {
                    document.getElementById('dob-error').textContent = 'Please select a valid date of birth';
                    document.getElementById('dob-error').style.display = 'block';
                    isValid = false;
                } else {
                    // Check if the user is at least 13 years old
                    const dob = new Date(year, month - 1, day);
                    const today = new Date();
                    let age = today.getFullYear() - dob.getFullYear();
                    const monthDiff = today.getMonth() - dob.getMonth();
                    
                    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
                        age--;
                    }
                    
                    if (age < 13) {
                        document.getElementById('dob-error').textContent = 'You must be at least 13 years old to sign up';
                        document.getElementById('dob-error').style.display = 'block';
                        isValid = false;
                    } else {
                        document.getElementById('dob-error').style.display = 'none';
                    }
                }
                
                return isValid;
            }
            
            function validateStep2() {
                let isValid = true;
                const email = document.getElementById('email').value.trim();
                const phone = document.getElementById('phone').value.trim();
                
                if (!email) {
                    document.getElementById('email-error').textContent = 'Please enter a valid email address';
                    document.getElementById('email-error').style.display = 'block';
                    isValid = false;
                } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
                    document.getElementById('email-error').textContent = 'Please enter a valid email address';
                    document.getElementById('email-error').style.display = 'block';
                    isValid = false;
                } else {
                    document.getElementById('email-error').style.display = 'none';
                }
                
                if (phone && !/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone)) {
                    document.getElementById('phone-error').textContent = 'Please enter a valid phone number';
                    document.getElementById('phone-error').style.display = 'block';
                    isValid = false;
                } else {
                    document.getElementById('phone-error').style.display = 'none';
                }
                
                return isValid;
            }
            
            function validateStep3() {
                let isValid = true;
                const username = document.getElementById('username').value.trim();
                const password = document.getElementById('password').value;
                
                if (username.length < 4) {
                    document.getElementById('username-error').textContent = 'Username must be at least 4 characters';
                    document.getElementById('username-error').style.display = 'block';
                    isValid = false;
                } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                    document.getElementById('username-error').textContent = 'Username can only contain letters, numbers, and underscores';
                    document.getElementById('username-error').style.display = 'block';
                    isValid = false;
                } else {
                    document.getElementById('username-error').style.display = 'none';
                }
                
                if (password.length < 8) {
                    document.getElementById('password-error').textContent = 'Password must be at least 8 characters';
                    document.getElementById('password-error').style.display = 'block';
                    isValid = false;
                } else {
                    document.getElementById('password-error').style.display = 'none';
                }
                
                return isValid;
            }
            
            // Form submission
            document.getElementById('registrationForm').addEventListener('submit', async function(e) {
                e.preventDefault();
                
                // Combine all form data
                const formData = {
                    name: document.getElementById('name').value.trim(),
                    month: document.getElementById('month').value,
                    day: document.getElementById('day').value,
                    year: document.getElementById('year').value,
                    email: document.getElementById('email').value.trim(),
                    phone: document.getElementById('phone').value.trim(),
                    username: document.getElementById('username').value.trim(),
                    password: document.getElementById('password').value
                };
                
                try {
                    const response = await fetch('/api/register', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(formData)
                    });
                    
                    const data = await response.json();
                    
                    if (response.ok) {
                        // Redirect to login page after successful registration
                        window.location.href = 'login.html';
                    } else {
                        // Show error message
                        alert(data.message || 'Registration failed. Please try again.');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred. Please try again.');
                }
            });
        });