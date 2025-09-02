const themeToggle = document.querySelector('.theme-toggle')
const promptBtn = document.querySelector('.prompt-btn')
const promptInput = document.querySelector('.prompt-input')
const generateBtn = document.querySelector('.generate-btn')
const promptForm = document.querySelector('.prompt-form')
const modelSelect = document.getElementById('model-select')
const countSelect = document.getElementById('count-select')
const ratioSelect = document.getElementById('ratio-select')
const gridGallery = document.querySelector('.gallery-grid')

const API_KEY = '' // please , use your own huggingface api key if you want to ch
const baseSize = 512
const examplePrompts = [
	'A magic forest with glowing plants and fairy homes among giant mushrooms',
	'An old steampunk airship floating through golden clouds at sunset',
	'A future Mars colony with glass domes and gardens against red mountains',
	'A dragon sleeping on gold coins in a crystal cave',
	'An underwater kingdom with merpeople and glowing coral buildings',
	'A floating island with waterfalls pouring into clouds below',
	"A witch's cottage in fall with magic herbs in the garden",
	'A robot painting in a sunny studio with art supplies around it',
	'A magical library with floating glowing books and spiral staircases',
	'A Japanese shrine during cherry blossom season with lanterns and misty mountains',
	'A cosmic beach with glowing sand and an aurora in the night sky',
	'A medieval marketplace with colorful tents and street performers',
	'A cyberpunk city with neon signs and flying cars at night',
	'A peaceful bamboo forest with a hidden ancient temple',
	'A giant turtle carrying a village on its back in the ocean',
]

;(() => {
	const savedTheme = localStorage.getItem('theme')
	const systemPrefersDark = window.matchMedia(
		'(prefers-color-scheme: dark)'
	).matches
	const isDarkTheme =
		savedTheme === 'dark' || (!savedTheme && systemPrefersDark)

	document.body.classList.toggle('dark-theme', isDarkTheme)
	themeToggle.querySelector('i').className = isDarkTheme
		? 'fa-solid fa-sun'
		: 'fa-solid fa-moon'
})()

const toggleTheme = () => {
	const isDarkTheme = document.body.classList.toggle('dark-theme')
	localStorage.setItem('theme', isDarkTheme ? 'dark' : 'light')
	themeToggle.querySelector('i').className = isDarkTheme
		? 'fa-solid fa-sun'
		: 'fa-solid fa-moon'
}

const getImageDimensions = aspectRatio => {
	const [width, height] = aspectRatio.split('/').map(Number)
	const scaleFactor = baseSize / Math.sqrt(width * height)

	let calculatedWidth = Math.round(width * scaleFactor)
	let calculatedHeight = Math.round(height * scaleFactor)

	calculatedWidth = Math.floor(calculatedWidth / 16) * 16
	calculatedHeight = Math.floor(calculatedHeight / 16) * 16

	return { width: calculatedWidth, height: calculatedHeight }
}

const updateImagesCard = (imageIndex, imgUrl) => {
	const imgCard = document.getElementById(`img-card-${imageIndex}`)
	if (!imgCard) return

	imgCard.classList.remove('loading')
	imgCard.innerHTML = `
		<img src="${imgUrl}" class="result-img">
		<div class="img-overlay">
			<a href="${imgUrl}" class="img-download-btn" download="image-${imageIndex}.png">
				<i class="fa-solid fa-download"></i>
			</a>
		</div>`
}

const generateImages = async (
	selectedModel,
	imageCount,
	aspectRatio,
	promptText
) => {
	const MODEL_URL = `https://api-inference.huggingface.co/models/${selectedModel}`
	const { width, height } = getImageDimensions(aspectRatio)

	generateBtn.setAttribute('disabled', 'true')

	const imagePromises = Array.from({ length: imageCount }, async (_, i) => {
		try {
			const response = await fetch(MODEL_URL, {
				headers: {
					Authorization: `Bearer ${API_KEY}`,
					'Content-Type': 'application/json',
					'x-use-cache': 'false',
				},
				method: 'POST',
				body: JSON.stringify({
					inputs: promptText,
					parameters: { width, height },
					options: { wait_for_model: true, user_cache: false },
				}),
			})

			if (!response.ok) throw new Error((await response.json())?.error)

			const result = await response.blob()
			updateImagesCard(i, URL.createObjectURL(result))
		} catch (error) {
			console.error(error)
			const imgCard = document.getElementById(`img-card-${i}`)
			imgCard.classList.replace('loading', 'error')
			imgCard.querySelector('.status-text').textContent = 'Generate Failed'
		}
	})

	await Promise.allSettled(imagePromises)
	generateBtn.removeAttribute('disabled')
}

const createImageCards = (
	selectedModel,
	imageCount,
	aspectRatio,
	promptText
) => {
	gridGallery.innerHTML = ''
	for (let i = 0; i < imageCount; i++) {
		gridGallery.innerHTML += `
			<div class="img-card loading" id="img-card-${i}" style="aspect-ratio: ${aspectRatio}">
				<div class="status-container">
					<div class="spinner"></div>
					<i class="fa-solid fa-triangle-exclamation"></i>
					<p class="status-text">Generating...</p>
				</div>
				<img src="test.png" class="result-img">
			</div>`
	}
	generateImages(selectedModel, imageCount, aspectRatio, promptText)
}

const handleFormSubmit = e => {
	e.preventDefault()

	const selectedModel = modelSelect.value
	const imageCount = parseInt(countSelect.value) || 1
	const aspectRatio = ratioSelect.value || '1/1'
	const promptText = promptInput.value.trim()

	createImageCards(selectedModel, imageCount, aspectRatio, promptText)
}

promptBtn.addEventListener('click', () => {
	const prompt =
		examplePrompts[Math.floor(Math.random() * examplePrompts.length)]
	promptInput.value = prompt
	promptInput.focus()
})

promptForm.addEventListener('submit', handleFormSubmit)
themeToggle.addEventListener('click', toggleTheme)
