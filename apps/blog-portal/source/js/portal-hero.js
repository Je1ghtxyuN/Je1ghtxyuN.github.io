(function portalHero() {
  var page = document.querySelector('.type-portal-home')
  if (!page) return

  var header = document.getElementById('page-header')
  if (!header) return

  // Create hero info container
  var heroInfo = document.createElement('div')
  heroInfo.className = 'portal-hero-info'

  var title = document.createElement('h1')
  title.className = 'portal-hero-info__title'
  title.textContent = 'Je1ghtxyuN'

  var subtitle = document.createElement('div')
  subtitle.className = 'portal-hero-info__subtitle'

  var cursor = document.createElement('span')
  cursor.className = 'typed-cursor'
  cursor.textContent = '|'

  heroInfo.appendChild(title)
  heroInfo.appendChild(subtitle)
  header.appendChild(heroInfo)

  // Scroll hint
  var scrollHint = document.createElement('div')
  scrollHint.className = 'portal-scroll-hint'
  scrollHint.textContent = '▼  scroll down'
  scrollHint.addEventListener('click', function () {
    var main = document.getElementById('content-inner')
    if (main) {
      main.scrollIntoView({ behavior: 'smooth' })
    }
  })
  header.appendChild(scrollHint)

  // Typewriter effect
  var phrases = [
    'Code, Anime, Games, and Coffee.',
    'Elegant technical blog and portfolio foundation.',
    'Building a calm, long-term personal platform.'
  ]
  var phraseIndex = 0
  var charIndex = 0
  var isDeleting = false
  var typeSpeed = 60
  var deleteSpeed = 30
  var pauseBetween = 2000

  function type() {
    var currentPhrase = phrases[phraseIndex]

    if (isDeleting) {
      subtitle.textContent = currentPhrase.substring(0, charIndex - 1)
      charIndex--
    } else {
      subtitle.textContent = currentPhrase.substring(0, charIndex + 1)
      charIndex++
    }

    subtitle.appendChild(cursor)

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Finished typing, pause then start deleting
      setTimeout(function () {
        isDeleting = true
        type()
      }, pauseBetween)
      return
    }

    if (isDeleting && charIndex === 0) {
      isDeleting = false
      phraseIndex = (phraseIndex + 1) % phrases.length
      setTimeout(type, 400)
      return
    }

    setTimeout(type, isDeleting ? deleteSpeed : typeSpeed)
  }

  // Start with a small delay
  setTimeout(type, 800)

  // Make header nav transparent
  var nav = header.querySelector('#nav')
  if (nav) {
    nav.classList.add('portal-nav-transparent')
  }
})()
