const handleSaveSection = async (section) => {
    try {
        let response;
        console.log('Saving section:', section);
        console.log('Current userId:', userId);

        if (!userId) {
            throw new Error('User ID is not available');
        }
        
        if (section === 'Basic Info') {
            // Log the data being sent
            const basicData = {
                name: formData.basics.name,
                role: formData.basics.role,
                bio: formData.basics.bio,
                email: formData.basics.email,
                phone: formData.basics.phone,
                location: formData.basics.location,
                profileImage: formData.basics.profileImage,
                socialLinks: formData.basics.socialLinks
            };
            console.log('Sending basic info data:', basicData);

            // Save basic info to the backend
            response = await fetch(`http://localhost:3000/portfolio/template/${userId}/basics`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(basicData),
            });

            const data = await response.json();
            console.log('Response from server:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to save changes');
            }

            // Update the form data with the response data
            setFormData(prev => ({
                ...prev,
                basics: data.data.basics,
                socialLinks: data.data.socialLinks
            }));

            // Show success message using a more user-friendly approach
            // You can replace this with a toast notification or a custom alert component
            const successMessage = document.createElement('div');
            successMessage.style.position = 'fixed';
            successMessage.style.top = '20px';
            successMessage.style.right = '20px';
            successMessage.style.backgroundColor = '#4CAF50';
            successMessage.style.color = 'white';
            successMessage.style.padding = '15px';
            successMessage.style.borderRadius = '5px';
            successMessage.style.zIndex = '1000';
            successMessage.textContent = 'Basic information saved successfully!';
            document.body.appendChild(successMessage);

            // Remove the success message after 3 seconds
            setTimeout(() => {
                document.body.removeChild(successMessage);
            }, 3000);

        } else {
            // Handle other sections (existing code)
            response = await fetch(`http://localhost:3000/authenticated-user/updatetemplate/${templateId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ data: formData }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to save changes');
            }

            // Show success message
            alert(`${section} saved successfully!`);
        }
    } catch (error) {
        console.error('Error saving changes:', error);
        // Show error message using a more user-friendly approach
        const errorMessage = document.createElement('div');
        errorMessage.style.position = 'fixed';
        errorMessage.style.top = '20px';
        errorMessage.style.right = '20px';
        errorMessage.style.backgroundColor = '#f44336';
        errorMessage.style.color = 'white';
        errorMessage.style.padding = '15px';
        errorMessage.style.borderRadius = '5px';
        errorMessage.style.zIndex = '1000';
        errorMessage.textContent = `Failed to save ${section}: ${error.message}`;
        document.body.appendChild(errorMessage);

        // Remove the error message after 3 seconds
        setTimeout(() => {
            document.body.removeChild(errorMessage);
        }, 3000);
    }
}; 