
(function($) {

	var	$window = $(window),
		$body = $('body'),
		$html = $('html');

	// // Breakpoints.
	// 	breakpoints({
	// 		xlarge:  [ '1281px',  '1680px' ],
	// 		large:   [ '981px',   '1280px' ],
	// 		medium:  [ '737px',   '980px'  ],
	// 		small:   [ null,      '736px'  ]
	// 	});

	// Play initial animations on page load.
		$window.on('load', function() {
			window.setTimeout(function() {
				$body.removeClass('is-preload');
			}, 100);
		});

	// Dropdowns.
        $('#nav > ul').dropotron({
            mode: 'fade',
            noOpenerFade: true,
            speed: 300
        });

	// Add an accessible close control beside each speaker homepage link.
		$('.iwym-speaker-modal').each(function() {
			var $modal = $(this),
				$dialog = $modal.children('div').first(),
				$title = $dialog.children('h3').first(),
				$close = $modal.find('.iwym-speaker-close').first(),
				$actions = $title.next('p'),
				closeLabel = $close.text();

			if (!$close.length || !$actions.length)
				return;

			$actions.addClass('iwym-speaker-modal-actions');
			$close
				.attr('aria-label', closeLabel)
				.attr('title', closeLabel)
				.text('×')
				.appendTo($actions);

			$dialog.addClass('iwym-speaker-dialog');
			$title
				.nextAll()
				.appendTo($('<div class="iwym-speaker-dialog-body"></div>').appendTo($dialog));
		});

		if ($('.iwym-speaker-modal:target').length)
			$html.add($body).addClass('iwym-speaker-modal-open');

	// Preserve the page position while opening and closing speaker details.
		function closeSpeakerModal($modal) {
			var scrollX = $modal.data('iwym-scroll-x') || 0,
				scrollY = $modal.data('iwym-scroll-y') || 0;

			$modal.addClass('iwym-speaker-modal-dismissed');
			$html.add($body).removeClass('iwym-speaker-modal-open');

			if (window.history && window.history.replaceState)
				window.history.replaceState(null, document.title, window.location.pathname + window.location.search);
			else
				window.location.hash = '';

			window.requestAnimationFrame(function() {
				window.scrollTo(scrollX, scrollY);
			});
		}

		$(document).on('click', '.iwym-speaker-more', function() {
			var $modal = $($(this).attr('href'));

			$html.add($body).addClass('iwym-speaker-modal-open');
			$modal
				.removeClass('iwym-speaker-modal-dismissed')
				.data('iwym-scroll-x', window.pageXOffset)
				.data('iwym-scroll-y', window.pageYOffset);
		});

		$(document).on('click', '.iwym-speaker-modal:target', function(event) {
			if (event.target !== this)
				return;

			closeSpeakerModal($(this));
		});

		$(document).on('click', '.iwym-speaker-close', function(event) {
			event.preventDefault();
			closeSpeakerModal($(this).closest('.iwym-speaker-modal'));
		});

	// Nav.

		// Toggle.
			$(
				'<div id="navToggle">' +
					'<a href="#navPanel" class="toggle"></a>' +
				'</div>'
			)
				.appendTo($body);

		// Panel.
			$(
				'<div id="navPanel">' +
					'<nav>' +
						$('#nav').navList() +
					'</nav>' +
				'</div>'
			)
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'left',
					target: $body,
					visibleClass: 'navPanel-visible'
				});

})(jQuery);

MathJax = {
	loader: {
		load: ['[tex]/boldsymbol']
	},
	tex: {
		inlineMath: [['$', '$'], ['\\(', '\\)']],
		packages: {
			'[+]': ['boldsymbol']
		},
		macros: {
			bm: ['\\boldsymbol{#1}', 1]
		}
	},
	svg: {
		fontCache: 'global'
	}
};
