document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const messageDiv = document.getElementById('message');

    // Form submission handler
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            gender: document.getElementById('gender').value,
            email: document.getElementById('email').value,
            country: document.getElementById('country').value
        };
        
        // Basic validation
        if (!formData.name || !formData.gender || !formData.email || !formData.country) {
            showMessage('Please fill in all fields.', 'error');
            return;
        }
        
        // Email validation
        if (!isValidEmail(formData.email)) {
            showMessage('Please enter a valid email address.', 'error');
            return;
        }
        
        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });
            
            const result = await response.json();
            
            if (response.ok) {
                showMessage('Registration successful!', 'success');
                form.reset();
            } else {
                showMessage(result.error || 'Registration failed. Please try again.', 'error');
            }
        } catch (error) {
            console.error('Error:', error);
            showMessage('Network error. Please try again.', 'error');
        }
    });
    
    // Email validation function
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Show message function
    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = `message ${type} show`;
        
        // Hide message after 5 seconds
        setTimeout(() => {
            messageDiv.className = 'message';
        }, 5000);
    }
    
    // Real-time validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });
    });
    
    function validateField(field) {
        const value = field.value.trim();
        
        // Remove any existing error styling
        field.style.borderColor = '';
        
        if (!value) {
            field.style.borderColor = '#dc3545';
            return false;
        }
        
        if (field.type === 'email' && !isValidEmail(value)) {
            field.style.borderColor = '#dc3545';
            return false;
        }
        
        field.style.borderColor = '#28a745';
        return true;
    }
});