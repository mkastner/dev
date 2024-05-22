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

		document.getElementById("loadingIndicator").style.display = "block" // Zeige den Ladeindikator
		document.querySelector("button[type='submit']").disabled = true // Deaktiviere den Senden-Button

		try {
			const response = await fetch(apiUrl, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			})

			document.getElementById("loadingIndicator").style.display = "none" // Verstecke den Ladeindikator
			document.querySelector("button[type='submit']").disabled = false // Aktiviere den Senden-Button

			if (response.ok) {
				alert("Vielen Dank für Ihre Nachricht.")
			} else {
				const errorData = await response.json() // Lese Fehlermeldung vom Server
				alert(`Fehler: ${errorData.message}`) // Zeige spezifische Fehlermeldung
			}
		} catch (error) {
			console.error("Fehler beim Senden der Anfrage:", error)
			alert(
				"Ein Fehler ist aufgetreten. Bitte überprüfen Sie Ihre Netzwerkverbindung und versuchen Sie es erneut.",
			)
			document.getElementById("loadingIndicator").style.display = "none" // Verstecke den Ladeindikator im Fehlerfall
			document.querySelector("button[type='submit']").disabled = false // Aktiviere den Senden-Button
		}
	})
