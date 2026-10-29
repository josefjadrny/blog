(function () {
    var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Age and years of experience, always up to date
    var YEAR_MS = 1000 * 3600 * 24 * 365.25;
    var age = (new Date() - new Date('1988-01-22T00:00:00')) / YEAR_MS;
    var experience = (new Date() - new Date('2012-05-01T00:00:00')) / YEAR_MS;

    document.getElementById('age').textContent = age.toFixed(2);
    document.getElementById('exp').textContent = experience.toFixed(1);
    document.querySelectorAll('.years-total').forEach(function (el) {
        el.textContent = Math.floor(experience);
    });
    document.getElementById('year').textContent = new Date().getFullYear();

    // Nav: solid background once scrolled, highlight the section in view
    var nav = document.getElementById('nav');
    function onScroll() {
        nav.classList.toggle('is-scrolled', window.scrollY > 10);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    var navLinks = document.querySelectorAll('.nav-links a');

    // Typewriter for the info.ts card: types the text nodes in order and keeps the syntax colours
    var typer = document.getElementById('typewriter');

    function setupTypewriter(pre) {
        var nodes = [];
        var walker = document.createTreeWalker(pre, NodeFilter.SHOW_TEXT);
        while (walker.nextNode()) {
            nodes.push({ node: walker.currentNode, text: walker.currentNode.textContent });
        }

        // keep the card at its final height so the page does not jump while typing
        pre.style.minHeight = pre.offsetHeight + 'px';
        nodes.forEach(function (item) { item.node.textContent = ''; });

        var cursor = document.createElement('span');
        cursor.className = 'typing-cursor';

        var nodeIndex = 0;
        var charIndex = 0;

        function step() {
            var item = nodes[nodeIndex];
            if (!item) {
                setTimeout(function () { cursor.remove(); }, 1500);
                return;
            }

            var ch = item.text.charAt(charIndex);
            item.node.textContent += ch;
            item.node.parentNode.insertBefore(cursor, item.node.nextSibling);
            charIndex += 1;

            if (charIndex >= item.text.length) {
                nodeIndex += 1;
                charIndex = 0;
            }

            // whitespace runs fast so indentation does not crawl
            var delay = /\s/.test(ch) ? 4 : 18 + Math.random() * 30;
            setTimeout(step, delay);
        }

        return step;
    }

    // Reveal on scroll, staggered per group
    document.querySelectorAll('.timeline, .projects, .hero-text').forEach(function (group) {
        group.querySelectorAll('.reveal').forEach(function (el, i) {
            el.style.setProperty('--delay', Math.min(i * 0.08, 0.4) + 's');
        });
    });

    if (!('IntersectionObserver' in window) || reduceMotion) {
        document.querySelectorAll('.reveal').forEach(function (el) { el.classList.add('is-visible'); });
        return;
    }

    var startTyping = setupTypewriter(typer);
    var typerStarted = false;

    var revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);

            if (!typerStarted && entry.target.contains(typer)) {
                typerStarted = true;
                setTimeout(startTyping, 400);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    document.querySelectorAll('.reveal').forEach(function (el) { revealObserver.observe(el); });

    var sectionObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (!entry.isIntersecting) return;
            navLinks.forEach(function (link) {
                link.classList.toggle('is-active', link.getAttribute('href') === '#' + entry.target.id);
            });
        });
    }, { rootMargin: '-45% 0px -50% 0px' });

    document.querySelectorAll('main section[id]').forEach(function (section) { sectionObserver.observe(section); });

    // Pointer light on the project cards
    document.querySelectorAll('.project').forEach(function (card) {
        card.addEventListener('pointermove', function (event) {
            var rect = card.getBoundingClientRect();
            card.style.setProperty('--mx', (event.clientX - rect.left) + 'px');
            card.style.setProperty('--my', (event.clientY - rect.top) + 'px');
        });
    });
})();
