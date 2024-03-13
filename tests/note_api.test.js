import { test, after, beforeEach } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from 'supertest';
import app from '../app.js';
import Note from '../models/note.js';
import helper from './test_helper.js';

const api = supertest(app);

beforeEach(async () => {
	await Note.deleteMany({});
	const noteObjects = helper.initialNotes.map((note) => new Note(note));
	const promiseArray = noteObjects.map((note) => note.save());
	await Promise.all(promiseArray);
});

test('notes are returned as json', async () => {
	await api
		.get('/api/notes')
		.expect(200)
		.expect('Content-Type', /application\/json/);
});

test('there are two notes', async () => {
	const response = await api.get('/api/notes');

	assert.strictEqual(response.body.length, helper.initialNotes.length);
});

test('the first note is about HTTP methods', async () => {
	const response = await api.get('/api/notes');

	const contents = response.body.map((e) => e.content);
	assert(contents.includes('HTML is easy'));
});

test('a valid note can be added', async () => {
	const newNote = {
		content: 'async/await simplifies making async calls',
		important: true,
	};

	await api
		.post('/api/notes')
		.send(newNote)
		.expect(201)
		.expect('Content-Type', /application\/json/);

	const notes = await helper.notesInDb();

	assert.strictEqual(notes.length, helper.initialNotes.length + 1);
	const contents = notes.map((n) => n.content);
	assert(contents.includes('async/await simplifies making async calls'));
});

test('note without content is not added', async () => {
	const newNote = {
		important: true,
	};

	await api.post('/api/notes').send(newNote).expect(400);

	const notesDb = await helper.notesInDb();

	assert.strictEqual(notesDb.length, helper.initialNotes.length);
});

test('a specific note can be viewed', async () => {
	const notesDb = await helper.notesInDb();

	const noteToView = notesDb[0];

	const resultNote = await api
		.get(`/api/notes/${noteToView.id}`)
		.expect(200)
		.expect('Content-Type', /application\/json/);

	assert.deepStrictEqual(resultNote.body, noteToView);
});

test('a note can be delete', async () => {
	const notesDb = await helper.notesInDb();

	const noteToDelete = notesDb[1];

	await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

	const notesAtEnd = await helper.notesInDb();

	assert.strictEqual(notesAtEnd.length, notesDb.length - 1);
});

after(async () => {
	await mongoose.connection.close();
});
