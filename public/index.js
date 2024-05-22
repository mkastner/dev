document
	.getElementById("contactForm")
	.addEventListener("submit", async function (event) {
		event.preventDefault()
		let firstname = document.getElementById("firstname").value
		let lastname = document.getElementById("lastname").value
		let email = document.getElementById("email").value
		let message = document.getElementById("message").value
		let privacy = document.getElementById("privacy").checked ? "on" : "off"

		// Daten für die Übertragung als JSON vorbereiten
		const data = {
			firstname: firstname,
			lastname: lastname,
			email: email,
			message: message,
			privacy: privacy,
		}

		const apiUrl = "https://api.msc-connect.xyz/api/form/"

		try {
			console.log("Daten senden:", data)
			const response = await fetch(apiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})

			if (response.ok) {
				alert("Vielen Dank für Ihre Nachricht.")
			} else if (response.status === 400) {
				alert("Fehler: Fehlende oder ungültige Daten.")
			} else if (response.status === 500) {
				alert("Serverfehler. Bitte versuchen Sie es später erneut.")
			} else {
				alert(`Unbekannter Fehler: HTTP ${response.status}`)
			}
		} catch (error) {
			console.error("Fehler beim Senden der Anfrage:", error)
			alert(
				"Ein Fehler ist aufgetreten. Bitte überprüfen Sie Ihre Netzwerkverbindung und versuchen Sie es erneut.",
			)
		}
	})
