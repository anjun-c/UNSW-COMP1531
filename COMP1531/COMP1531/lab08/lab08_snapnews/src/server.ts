/**
 * If you are looking for a way to reduce repetition instead of adding
 * try/catch to each of your routes, take a look at lab05_forum's solution
 * branch, inside src.alternate. One way was shown is to define custom errors
 * and an errorHandler that maps the custom errors to HTTP status codes, which
 * allows us to write our routes in 1 line of code (i.e. just res.json).
 *
 * Alternatively, you could also define handler wrapper functions and re-use the
 * same logic (e.g. checking for auth token) across different routes.
 *
 * However, keeping things simple with try/catch as shown below is fine and acceptable
 * in COMP1531.
 */

import express, { json, Request, Response } from 'express';
// Middleware to allow connections with the frontend
import cors from 'cors';
// Middleware to log (print to terminal) incoming HTTP requests
import morgan from 'morgan';

// Importing the example implementation for echo in echo.js
import { port, url } from './config.json';
import { clear, createAnnouncement, deleteAnnouncement, listAnnouncements } from './snapnews';
import { checkAuthToken } from './auth';

const PORT: number = parseInt(process.env.PORT || port);
const HOST: string = process.env.IP || '127.0.0.1';

const app = express();

// Use middleware that allows for access from other domains (needed for frontend to connect)
app.use(cors());
// Use middleware that allows us to access the JSON body of requests
app.use(json());
// Use middleware to log (print to terminal) incoming HTTP requests
app.use(morgan('dev'));

// Root URL
app.get('/', (req: Request, res: Response) => {
  console.log('Print to terminal: someone accessed our root url!');
  res.json({ message: "Welcome to Lab08 Snap News Server's root URL!" });
});

// ========================================================================= //
// YOUR ROUTES SHOULD BE DEFINED BELOW THIS DIVIDER
// ========================================================================= //

app.delete('/v1/clear', (req: Request, res: Response) => {
  res.json(clear());
});

app.post('/v1/announcements/create', (req: Request, res: Response) => {
  const lab08snapnewstoken = req.body.lab08snapnewstoken as string;
  try {
    checkAuthToken(lab08snapnewstoken);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }

  try {
    res.json(createAnnouncement(req.body.title, req.body.description));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.get('/v1/announcements/list', (req: Request, res: Response) => {
  const lab08snapnewstoken = req.query.lab08snapnewstoken as string;
  try {
    checkAuthToken(lab08snapnewstoken);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
  res.json(listAnnouncements());
});

app.delete('/v1/announcements/:announcementid', (req: Request, res: Response) => {
  const lab08snapnewstoken = req.query.lab08snapnewstoken as string;
  try {
    checkAuthToken(lab08snapnewstoken);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }

  try {
    res.json(deleteAnnouncement(parseInt(req.params.announcementid as string)));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// ========================================================================= //
// Task 1: implement V2 Routes

app.post('/v2/announcements/create', (req: Request, res: Response) => {
  const lab08snapnewstoken = req.headers.lab08snapnewstoken as string;
  try {
    checkAuthToken(lab08snapnewstoken);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }
  res.json(listAnnouncements());
});

app.delete('/v2/announcements/:announcementid', (req: Request, res: Response) => {
  const lab08snapnewstoken = req.headers.lab08snapnewstoken as string;
  try {
    checkAuthToken(lab08snapnewstoken);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }

  try {
    res.json(deleteAnnouncement(parseInt(req.params.announcementid as string)));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

app.delete('/v2/clear', (req: Request, res: Response) => {
  res.json(clear());
});

app.post('/v2/announcements/create', (req: Request, res: Response) => {
  const lab08snapnewstoken = req.body.lab08snapnewstoken as string;
  try {
    checkAuthToken(lab08snapnewstoken);
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }

  try {
    res.json(createAnnouncement(req.body.title, req.body.description));
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// ========================================================================= //
// Task 2: implement v1 (new) Routes (schedule and schedule abort)

// TODO: add new /v1/ routes here
// ...
// ...
// ...

// ========================================================================= //
// YOUR ROUTES SHOULD BE DEFINED ABOVE THIS DIVIDER
// ========================================================================= //

/*
 * 404 Not Found Middleware
 *
 * This should be put at the very end (after all your routes are defined),
 * although still above errorHandlers (if any) and app.listen().
 */
app.use((req: Request, res: Response) => {
  const error = `
    404 Not found - This could be because:
      0. You have defined routes below (not above) this middleware in server.ts
      1. You have not implemented the route ${req.method} ${req.path}
      2. There is a typo in either your test or server, e.g. /announcements/list in one
         and, incorrectly, /announcement/list in the other
      3. You are using ts-node (instead of ts-node-dev) to start your server and
         have forgotten to manually restart to load the new changes
      4. You've forgotten a leading slash (/), e.g. you have announcements/list instead
         of /announcements/list in your server.ts or test file
  `;
  res.status(404).json({ error });
});

/**
 * Start server
 */
const server = app.listen(PORT, HOST, () => {
  console.log(`Express Server started and awaiting requests at the URL: '${url}:${PORT}'`);
});

/**
 * For coverage, handle Ctrl+C gracefully
 */
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Shutting down server gracefully.');
    process.exit();
  });
});
