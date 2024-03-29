jQuery(function() {
  var MatchingGame;

  MatchingGame = {

    init: function() {
      var cards,
          $container;

      cards = this.createPairs($('.pair'));
      $container = $('.container');

      this.renderCards($container, cards);
      this.applyUserSettings($container)
    },

    // pair up the items and return them all
    createPairs: function($pairs) {
      var $entry,
          $firstCard,
          $secondCard,
          $bothCards,
          cards = [];

      $pairs.each(function() {
        $entry = $(this);

        $firstCard  = $entry.find('div:first');
        $secondCard = $entry.find('div:nth-child(2)');
        $bothCards  = $firstCard.add($secondCard);

        // assign same id to both for later comparison
        $bothCards.data('match-id', cards.length);

        cards.push($firstCard);
        cards.push($secondCard);
      });

      return cards;
    },

    renderCards: function($container, cards) {
      var _this = this;

      // shuffle the array
      cards.sort(function() {
        return 0.5 - Math.random();
      });

      $.each(cards, function(i, cardContent) {
        var $el;

        $el = $('<div>').addClass('card face-down')
                        .append(cardContent)
                        .appendTo($container)
                        .click( $.proxy(_this.cardClick, _this) )
      });
    },

    applyUserSettings: function($container) {
      var cardWidth,
          cardHeight;

      cardWidth  = $container.data('card-width');
      cardHeight = $container.data('card-height');

      $('.card').css({
        'line-height': cardHeight,
        'width': cardWidth,
        'height': cardHeight
      });
    },

    // cardClick 'this' is bound to MatchingGame obj
    cardClick: function(e) {
      var $card, $faceUp;

      $card = $(e.target);
      $card.removeClass('face-down')
           .addClass('face-up')

      $faceUp = $('.face-up:not(.correct)');

      if ($faceUp.length === 2) this.checkCorrect($faceUp);
    },

    checkCorrect: function($cards) {
      var $firstCard,
          $secondCard,
          $bothCards,
          $firstCardContent,
          $secondCardContent;

      $firstCard  = $($cards[0]);
      $secondCard = $($cards[1]);
      $bothCards  = $firstCard.add($secondCard);

      $firstCardContent  = $firstCard.find('div:first');
      $secondCardContent = $secondCard.find('div:first');

      if ($firstCardContent.data('match-id') === $secondCardContent.data('match-id')) {
        this.correct($bothCards);
      } else {
        this.incorrect($bothCards);
      }
    },

    correct: function($cards) {
      $cards.addClass('correct');
      $('.card.face-down').click( $.proxy(this.cardClick, this) );
    },

    incorrect: function($cards) {
      var _this = this;

      $('.card').unbind('click', this.cardClick);

      $cards.addClass('incorrect');

      $(document).one('mousedown', function(e) {
        $cards.removeClass('face-up incorrect')
              .addClass('face-down');
        $('.card.face-down').click( $.proxy(_this.cardClick, _this) );
      });
    }
  };

  MatchingGame.init();

});
