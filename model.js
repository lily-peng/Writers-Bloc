firsts = new Array('It was a dark and stormy night.',
'\"How many demons have you slain?\" the man said to Balendro. \"Just one, but it was a big one.\"',
'\"Fight the state.\" These were the words that have echoed in my mind for years.',
'It was an abnormally bright day in November when we parted ways.',
'I had heard this story from various people, and as generally happens in situations such as this, every person told a different tale.',
'It wasn\'t until he was on the firing squad that the Major thought about this day.',
'\"Where am I?!\" Nathaniel screamed into the darkness.',
'The park was empty, considering the weather.',
'My story begins on the happiest day of my life.',
'I remember thinking, \"I can still win this.\"',
'As soon as she entered the room, I could tell she would be nothing but trouble.',
'In the dark, damp cell, he began scribbling on the walls.',
'I really should have known when to give up.',
'There was no possibility of taking a walk that day.',
'I remember her well.',
'It was the afternoon of his forty-eighth birthday when Charles\' life was turned upside down.',
'For the longest time, I used to go to bed early.',
'\"That was a mistake.\"',
'He was a man named John Slattery, and he almost deserved it.',
'We were halfway out of town when the drugs started to kick in.',
'\"Why don\'t you start at the beginning? It\'s always the easiest,\" she said as we both put back another shot.',
'People always ask me \"Do you consider your book to be autobiographical?\"',
'\"Who are you?\"',
'She waited impatiently for the bus to pick up the kids.',
'\"Sorry I\'ve been gone so long. I won\'t let you down again.\"',
'They called him the Code Warrior. He lives now, but only in our memories.',
'I\'ve always loved this town.',
'I would rather have not known.',
'I couldn\'t help but overhear the women in the corner',
'We were scheduled to leave exactly at noon.',
'No one could believe they were back together.',
'She was crazy.',
'The whole idea didn\'t really appeal to him.');

lasts = new Array('The end. Or is it?',
                                    'It couldn\'t have been more perfect.',
                                    'Tomorrow, I\'ll think of some way to get him back. After all, tomorrow is another day.',
                                    'She smiled.',
                                    'She lowered the sword and noticed that the twitch had stopped.',
                                    '\"Wow, I can\'t believe that actually worked!\"',
                                    'At this point, what difference could it possibly have made?',
                                    '\"Isn\'t this where we began?\"',
                                    '\"They\'re never going to believe this back home.\"',
                                    'The prophecy was fulfilled.',
                                    'You just can\'t make this stuff up.',
                                    '\"But I can\'t leave. Everything I hate is right here...\"',
                                    'And they all lived happily ever after.',
                                    'He never knew my name, and still doesn\'t. I\'d prefer to keep it that way.',
                                    '\"Stand still. It\'ll all be over soon.\"',
                                    '\"All right, folks, you\'ve seen enough. Move along now.\"',
                                    'She had a feeling that this one would leave a scar.',
                                    '\"You\'ll have to wait for me. I still have work to do.\"',
                                    '\"Today you...tomorrow me.\"',
                                    '\"Goodbye, my friend.\"',
                                    'He rode off into the sunset.',
                                    'He drove off, filled with hope for the first time in years.',
                                    'And, with that, the attack began at 6:23 AM, just as they said it would.',
                                    'I was right.',
                                    'She was right.',
                                    'He spoke with almost robotic intonation. \"The decision rests with you. We\'ll be waiting for your answer.\"',
                                    'And there was nothing we could do to stop it.',
                                    'It was flawless.',
                                    'After all, what\'s the worst that could happen?',
                                    'She knew it to be true, for it was written.',
                                    'And that\'s why you always leave a note.',
                                    'I never said it\'d be a happy ending, did I?',
                                    'I suppose everything worked out in the end.',
                                    'It was all a dream.');

Games = new Meteor.Collection("games");
Players = new Meteor.Collection("players");
Messages = new Meteor.Collection("messages");
FirstSentences = new Meteor.Collection("firstSentences");
for (var i = 0; i < firsts.length; i++) {
  FirstSentences.insert(firsts[i]);
}
LastSentences = new Meteor.Collection("lastSentences");
for (var i = 0; i < lasts.length; i++) {
  LastSentences.insert(lasts[i]);
}
PlayerSentences = new Meteor.Collection("playerSentences");

