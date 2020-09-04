import * as functions from 'firebase-functions';

import 'firebase-functions/lib/logger/compat';

import * as cors from 'cors';

import * as admin from 'firebase-admin';
const app: admin.app.App = admin.initializeApp();
app.firestore().settings({timestampsInSnapshots: true});

import {applyWatchDeckCreate, applyWatchDeckDelete, applyWatchDeckUpdate} from './watch/watch-deck';
import {applyWatchUserCreate, applyWatchUserDelete, applyWatchUserUpdate} from './watch/watch-user';

import {publishDeck} from './request/publish/publish-deck';

const runtimeOpts = {
  timeoutSeconds: 120,
  memory: <const>'1GB',
};

const corsHandler = cors({origin: true});

export const watchDeckUpdate = functions.runWith(runtimeOpts).firestore.document('decks/{deckId}').onUpdate(applyWatchDeckUpdate);

export const watchDeckDelete = functions.firestore.document('decks/{deckId}').onDelete(applyWatchDeckDelete);

export const watchDeckCreate = functions.firestore.document('decks/{deckId}').onCreate(applyWatchDeckCreate);

export const watchUserUpdate = functions.firestore.document('users/{userId}').onUpdate(applyWatchUserUpdate);

export const watchUserDelete = functions.auth.user().onDelete(applyWatchUserDelete);

export const watchUserCreate = functions.auth.user().onCreate(applyWatchUserCreate);

export const publish = functions.runWith(runtimeOpts).https.onRequest((request: functions.Request, response: functions.Response<any>) => {
  corsHandler(request, response, async () => {
    await publishDeck(request, response);
  });
});
