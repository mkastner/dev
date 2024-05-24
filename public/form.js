const contactForm = document.getElementById('contactForm');
document.querySelector('button[type=\'submit\']').addEventListener('click', (ev) => {
  ev.preventDefault();
  // only activate the class
  // if a form submit was attempted
  contactForm.classList.add('was-submitted'); 
});

document
	.getElementById('contactForm')
	.addEventListener('submit', async function (event) {
		event.preventDefault()
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());

		const apiUrl = 'https://api.msc-connect.xyz/api/form/';

		// Ladeindikator anzeigen und Senden-Button deaktivieren
		document.getElementById('loadingIndicator').style.display = 'block'
		document.querySelector('button[type=\'submit\']').disabled = true

		try {
			const response = await fetch('apiUrl', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			})

			// Ladeindikator ausblenden und Senden-Button aktivieren
			document.getElementById('loadingIndicator').style.display = 'none'
			document.querySelector('button[type=\'submit\']').disabled = false

			if (response.ok) {
				alert('Vielen Dank für Ihre Nachricht.')
			} else {
				const errorData = await response.json()
				alert(`Fehler: ${errorData.message}`)
			}
		} catch (error) {
			console.error('Fehler beim Senden der Anfrage:', error)
			alert(
				'Ein Fehler ist aufgetreten. Bitte überprüfen Sie Ihre Netzwerkverbindung und versuchen Sie es erneut.',
			)

			// Ladeindikator ausblenden und Senden-Button aktivieren im Fehlerfall
			document.getElementById('loadingIndicator').style.display = 'none'
			document.querySelector('button[type=\'submit\']').disabled = false
    }
	})
