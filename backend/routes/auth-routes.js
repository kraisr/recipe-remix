import { Router } from 'express';
import passport from 'passport';

router.get('/google',
  passport.authenticate('google', { scope: ['profile'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => res.redirect('/profile')
);

router.get('/facebook',
  passport.authenticate('facebook')
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => res.redirect('/profile')
);

module.exports = router;
