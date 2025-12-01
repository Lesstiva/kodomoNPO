const activatedScenes = new Set();
const DONATION_URL = 'https://congrant.com/project/npojcsa/173/form/step1?_gl=1*rg0b4h*_gcl_au*MTUzNzI0NjgzOC4xNzY0NTkxMjUy*_ga*MjAzMTMwNDAwMi4xNzY0NTkxMjUy*_ga_9MGQCPJ9MK*czE3NjQ2MDA3NzYkbzIkZzEkdDE3NjQ2MDM5NzYkajckbDAkaDk1MjYxMTAxMg..&_ga=2.221748312.1734535376.1764591252-2031304002.1764591252';
let totalScenes = 0;
const motionMediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
let shouldReduceMotion = motionMediaQuery.matches;
let animationSpeedFactor = 1;
const MOBILE_SPEED_BREAKPOINT = 768;
const MOTION_SKIP_BREAKPOINT = 1024;

document.addEventListener('DOMContentLoaded', () => {
    updateMotionPreference();
    applyInitialAnimationStates();
    preloadAssets();
    setupEventListeners();
    initializeAnimations();
    setupSceneObserver();
    updateProgressDots(1);
});

function preloadAssets() {
    const loadingScreen = document.getElementById('loading-screen');
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 500);
        }, 1000);
    });
}

function setupEventListeners() {
    document.querySelectorAll('.dot').forEach((dot) => {
        dot.addEventListener('click', () => {
            const targetScene = dot.dataset.scene;
            const sceneElement = document.querySelector(`.scene[data-scene="${targetScene}"]`);
            if (sceneElement) {
                sceneElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    document.querySelectorAll('.donation-card').forEach(card => {
        const amount = card.dataset.amount;
        if (amount === 'custom') return;
        card.addEventListener('click', () => {
            selectDonationAmount(amount);
        });
    });

    const customDonateButton = document.querySelector('.custom-donate-button');
    if (customDonateButton) {
        customDonateButton.addEventListener('click', (event) => {
            event.stopPropagation();
            const customValue = getCustomAmountValue();
            if (!customValue) {
                highlightInvalidCustomInput();
                return;
            }
            selectDonationAmount('custom', customValue);
        });
    }

    const headerDonateButton = document.getElementById('header-donate-button');
    if (headerDonateButton) {
        headerDonateButton.addEventListener('click', handleDonateClick);
    }

    const floatingDonateButton = document.getElementById('floating-donate-button');
    if (floatingDonateButton) {
        floatingDonateButton.addEventListener('click', handleDonateClick);
    }

    document.querySelectorAll('.chart-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            showChartDetails(item);
        });
    });
}

function setupSceneObserver() {
    const scenes = document.querySelectorAll('.scene');
    if (!scenes.length) return;
    totalScenes = scenes.length;

    scenes.forEach((scene, index) => {
        if (!scene.dataset.scene) {
            scene.dataset.scene = index + 1;
        }
    });

    if (!('IntersectionObserver' in window) || shouldReduceMotion) {
        toggleScrollIndicator(true);
        scenes.forEach(scene => {
            const number = parseInt(scene.dataset.scene, 10);
            if (!Number.isNaN(number) && !activatedScenes.has(number)) {
                triggerSceneAnimations(number);
                activatedScenes.add(number);
            }
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;

            const sceneNumber = parseInt(entry.target.dataset.scene, 10);
            if (Number.isNaN(sceneNumber)) return;

            updateProgressDots(sceneNumber);
            toggleScrollIndicator(sceneNumber === 1);

            if (!activatedScenes.has(sceneNumber)) {
                triggerSceneAnimations(sceneNumber);
                activatedScenes.add(sceneNumber);
            }
        });
    }, {
        threshold: 0.5
    });

    scenes.forEach(scene => observer.observe(scene));
}

function triggerSceneAnimations(sceneNumber) {
    switch(sceneNumber) {
        case 1:
            animateScene1Chart();
            break;
        case 2:
            animateScene2Data();
            break;
        case 3:
            animateScene3Authority();
            break;
        case 4:
            animateScene4Data();
            break;
        case 5:
            break;
    }
}

function animateScene1Chart() {
    const chartPoints = document.querySelectorAll('.chart-point');
    const chartLine = document.querySelector('.chart-line');
    const highlightLabel = document.querySelector('.highlight-label');
    
    if (shouldReduceMotion) {
        if (chartLine) {
            gsap.set(chartLine, { strokeDashoffset: 0 });
        }
        chartPoints.forEach((point, index) => {
            gsap.set(point, {
                r: index === chartPoints.length - 1 ? 7 : 5,
                opacity: 1
            });
        });
        if (highlightLabel) {
            gsap.set(highlightLabel, { opacity: 1, y: 0 });
        }
        return;
    }

    if (chartLine) {
        gsap.fromTo(chartLine, {
            strokeDashoffset: 1000
        }, {
            strokeDashoffset: 0,
            duration: getDuration(2),
            ease: 'power2.out'
        });
    }
    
    chartPoints.forEach((point, index) => {
        gsap.fromTo(point, {
            r: 0,
            opacity: 0
        }, {
            r: index === chartPoints.length - 1 ? 7 : 5,
            opacity: 1,
            duration: getDuration(0.5),
            delay: index * 0.2 * animationSpeedFactor,
            ease: 'back.out(1.7)'
        });
    });
    
    if (highlightLabel) {
        gsap.fromTo(highlightLabel, {
            opacity: 0,
            y: -10
        }, {
            opacity: 1,
            y: 0,
            duration: getDuration(0.8),
            delay: 1.8 * animationSpeedFactor,
            ease: 'power2.out'
        });
    }
}

function animateScene2Data() {
    const scene = document.querySelector('.scene-2');
    if (!scene || scene.dataset.animated === 'true') return;
    scene.dataset.animated = 'true';

    const introElements = scene.querySelectorAll('.scene-2-intro > *');
    const cards = scene.querySelectorAll('.case-card');
    const mediaImages = scene.querySelectorAll('.case-media img');

    if (shouldReduceMotion) {
        if (introElements.length) {
            gsap.set(introElements, { opacity: 1, y: 0 });
        }
        if (cards.length) {
            gsap.set(cards, { opacity: 1, y: 0, scale: 1 });
        }
        if (mediaImages.length) {
            gsap.set(mediaImages, { opacity: 1, scale: 1 });
        }
        return;
    }

    const tl = gsap.timeline();

    if (introElements.length) {
        tl.fromTo(introElements, {
            opacity: 0,
            y: 25
        }, {
            opacity: 1,
            y: 0,
            duration: getDuration(0.8),
            ease: 'power2.out',
            stagger: 0.15 * animationSpeedFactor
        });
    }

    if (cards.length) {
        tl.fromTo(cards, {
            opacity: 0,
            y: 40,
            scale: 0.96
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: getDuration(0.6),
            ease: 'power3.out',
            stagger: 0.18 * animationSpeedFactor
        }, '-=0.2');
    }

    if (mediaImages.length) {
        tl.fromTo(mediaImages, {
            opacity: 0,
            scale: 1.08
        }, {
            opacity: 1,
            scale: 1,
            duration: getDuration(0.7),
            ease: 'power2.out',
            stagger: 0.12 * animationSpeedFactor
        }, '-=0.5');
    }
}

function animateScene3Authority() {
    const scene = document.querySelector('.scene-3');
    if (!scene || scene.dataset.animated === 'true') return;
    scene.dataset.animated = 'true';

    const headerElements = scene.querySelectorAll('.authority-header > *');
    const profileCard = scene.querySelector('.authority-profile-card');
    const orgCard = scene.querySelector('.authority-org-card');
    const achievements = scene.querySelectorAll('.authority-achievements li');
    const orgRows = scene.querySelectorAll('.org-info-row');

    if (shouldReduceMotion) {
        if (headerElements.length) {
            gsap.set(headerElements, { opacity: 1, y: 0 });
        }
        if (profileCard) {
            gsap.set(profileCard, { opacity: 1, y: 0, scale: 1 });
        }
        if (orgCard) {
            gsap.set(orgCard, { opacity: 1, x: 0 });
        }
        if (achievements.length) {
            gsap.set(achievements, { opacity: 1, x: 0 });
        }
        if (orgRows.length) {
            gsap.set(orgRows, { opacity: 1, x: 0 });
        }
        return;
    }

    const headerDuration = getDuration(0.6);
    const cardDuration = getDuration(0.55);
    const detailDuration = getDuration(0.4);
    const staggerFast = 0.08 * animationSpeedFactor;

    const tl = gsap.timeline();

    if (headerElements.length) {
        tl.fromTo(headerElements, {
            opacity: 0,
            y: 25
        }, {
            opacity: 1,
            y: 0,
            duration: headerDuration,
            ease: 'power2.out',
            stagger: staggerFast
        });
    }

    if (profileCard) {
        tl.fromTo(profileCard, {
            opacity: 0,
            y: 40,
            scale: 0.96
        }, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: cardDuration,
            ease: 'power3.out'
        }, '-=0.2');
    }

    if (orgCard) {
        tl.fromTo(orgCard, {
            opacity: 0,
            x: 60
        }, {
            opacity: 1,
            x: 0,
            duration: cardDuration,
            ease: 'power3.out'
        }, '-=0.5');
    }

    if (achievements.length) {
        tl.fromTo(achievements, {
            opacity: 0,
            x: -20
        }, {
            opacity: 1,
            x: 0,
            duration: detailDuration,
            ease: 'power2.out',
            stagger: staggerFast
        }, '-=0.5');
    }

    if (orgRows.length) {
        tl.fromTo(orgRows, {
            opacity: 0,
            x: 20
        }, {
            opacity: 1,
            x: 0,
            duration: detailDuration,
            ease: 'power2.out',
            stagger: staggerFast
        }, '-=0.5');
    }
}

function animateScene4Data() {
    const resultValues = document.querySelectorAll('.scene-4 .result-value');
    
    resultValues.forEach(result => {
        const target = parseInt(result.dataset.target, 10);
        if (shouldReduceMotion) {
            result.textContent = target.toLocaleString();
        } else {
            animateCounter(result, 0, target, 2000);
        }
    });
}

function animateCounter(element, start, end, duration) {
    if (shouldReduceMotion) {
        element.textContent = end <= 100 ? `${end}%` : end.toLocaleString();
        return;
    }

    const startTime = performance.now();
    const isPercentage = end <= 100;
    const adjustedDuration = duration * animationSpeedFactor;
    
    function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / adjustedDuration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.floor(start + (end - start) * easeOut);
        
        if (isPercentage) {
            element.textContent = `${current}%`;
        } else {
            element.textContent = current.toLocaleString();
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = isPercentage ? `${end}%` : end.toLocaleString();
        }
    }
    
    requestAnimationFrame(updateCounter);
}

function updateMotionPreference() {
    const viewportNarrow = window.innerWidth <= MOTION_SKIP_BREAKPOINT;
    shouldReduceMotion = motionMediaQuery.matches || viewportNarrow;
    animationSpeedFactor = window.innerWidth <= MOBILE_SPEED_BREAKPOINT ? 0.75 : 1;
}

function getDuration(base) {
    if (shouldReduceMotion) {
        return 0.01;
    }
    return Math.max(base * animationSpeedFactor, 0.1);
}

function showChartDetails(chartItem) {
    const category = chartItem.dataset.label;
    const detailItems = document.querySelectorAll('.detail-item');
    
    detailItems.forEach(item => {
        item.classList.remove('active');
    });
    
    const categoryMap = {
        '食糧支援': 'food',
        '学習支援': 'education',
        '生活サポート': 'support',
        '管理費': 'admin'
    };

    const matchedKey = Object.keys(categoryMap).find((key) => category.includes(key));
    if (!matchedKey) return;

    const targetDetail = document.querySelector(`.detail-item[data-category="${categoryMap[matchedKey]}"]`);
    if (targetDetail) {
        targetDetail.classList.add('active');
        gsap.fromTo(targetDetail, {
            opacity: 0,
            y: 10
        }, {
            opacity: 1,
            y: 0,
            duration: 0.3
        });
    }
}

function updateProgressDots(activeScene) {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot) => {
        const dotScene = parseInt(dot.dataset.scene, 10);
        dot.classList.toggle('active', dotScene === activeScene);
    });
}

function toggleScrollIndicator(show) {
    const indicator = document.querySelector('.scene-indicator');
    if (!indicator) return;
    indicator.classList.toggle('hidden', !show);
}

function selectDonationAmount(amount, customValue = null) {
    const cards = document.querySelectorAll('.donation-card');
    cards.forEach(card => {
        card.classList.remove('selected');
    });
    
    const selectedCard = document.querySelector(`.donation-card[data-amount="${amount}"]`);
    if (selectedCard) {
        selectedCard.classList.add('selected');
        gsap.fromTo(selectedCard, {
            scale: 1
        }, {
            scale: 1.05,
            duration: 0.2,
            yoyo: true,
            repeat: 1
        });

        const targetAmount = amount === 'custom' ? customValue : amount;
        openDonationPage(targetAmount);
    }
}

function handleDonateClick() {
    const selectedCard = document.querySelector('.donation-card.selected');
    let amountValue = null;

    if (selectedCard) {
        const amount = selectedCard.dataset.amount;
        if (amount === 'custom') {
            amountValue = getCustomAmountValue();
            if (!amountValue) {
                highlightInvalidCustomInput();
                return;
            }
        } else {
            amountValue = amount;
        }
    }

    openDonationPage(amountValue);
}

function getCustomAmountValue() {
    const input = document.querySelector('.custom-amount-input');
    if (!input) return null;
    const value = parseInt(input.value, 10);
    if (Number.isNaN(value) || value <= 0) {
        return null;
    }
    return value;
}

function highlightInvalidCustomInput() {
    const input = document.querySelector('.custom-amount-input');
    if (!input) return;
    input.classList.add('input-error');
    input.focus();

    setTimeout(() => {
        input.classList.remove('input-error');
    }, 1500);
}

function openDonationPage(amount) {
    let url = DONATION_URL;
    if (amount) {
        url += (url.includes('?') ? '&' : '?') + `amount=${encodeURIComponent(amount)}`;
    }
    window.open(url, '_blank');
}

function initializeAnimations() {
    const mainTitle = document.querySelector('.main-title');
    const subtitle = document.querySelector('.subtitle');
    
    if (mainTitle && subtitle) {
        const duration = getDuration(1);
        gsap.to([mainTitle, subtitle], {
            opacity: 1,
            y: 0,
            duration,
            delay: 0.5,
            ease: 'power2.out',
            stagger: 0.2 * animationSpeedFactor
        });
    }
    
    const statBoxes = document.querySelectorAll('.stat-box');
    if (statBoxes.length > 0) {
        gsap.to(statBoxes, {
            opacity: 1,
            y: 0,
            duration: getDuration(0.8),
            delay: 0.8,
            ease: 'power2.out',
            stagger: 0.15 * animationSpeedFactor
        });
    }
    
    const chartContainer = document.querySelector('.abuse-chart-container');
    if (chartContainer) {
        gsap.to(chartContainer, {
            opacity: 1,
            y: 0,
            duration: getDuration(1),
            delay: 1.2,
            ease: 'power2.out'
        });
    }
    
    triggerSceneAnimations(1);
    activatedScenes.add(1);
}

function applyInitialAnimationStates() {
    if (shouldReduceMotion || !window.gsap) return;
    gsap.set(['.main-title', '.subtitle'], { opacity: 0, y: 30 });
    gsap.set('.stat-box', { opacity: 0, y: 30 });
    gsap.set('.abuse-chart-container', { opacity: 0, y: 50 });
    gsap.set('.scene-2 .scene-2-intro > *', { opacity: 0, y: 25 });
    gsap.set('.case-card', { opacity: 0, y: 40, scale: 0.96 });
    gsap.set('.case-media img', { opacity: 0, scale: 1.08 });
    gsap.set('.authority-header > *', { opacity: 0, y: 25 });
    gsap.set('.authority-profile-card', { opacity: 0, y: 40, scale: 0.96 });
    gsap.set('.authority-org-card', { opacity: 0, x: 60 });
    gsap.set('.authority-achievements li', { opacity: 0, x: -20 });
    gsap.set('.org-info-row', { opacity: 0, x: 20 });
}

let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateMotionPreference();
    }, 250);
});

if (motionMediaQuery.addEventListener) {
    motionMediaQuery.addEventListener('change', updateMotionPreference);
} else if (motionMediaQuery.addListener) {
    motionMediaQuery.addListener(updateMotionPreference);
}


