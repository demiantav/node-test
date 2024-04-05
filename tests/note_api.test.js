import { test, after, beforeEach, describe } from 'node:test';
import assert from 'node:assert';
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from 'supertest';
import app from '../app.js';
import Note from '../models/note.js';
import helper from './test_helper.js';

const api = supertest(app);

describe('when there is initially some notes saved', () => {
	beforeEach(async () => {
		await Note.deleteMany({});
		await Note.insertMany(helper.initialNotes);
	});

	test('notes are returned as json', async () => {
		await api
			.get('/api/notes')
			.expect(200)
			.expect('Content-Type', /application\/json/);
	});

	test('all notes are returned', async () => {
		const response = await api.get('/api/notes');

		assert.strictEqual(response.body.length, helper.initialNotes.length);
	});

	test('a specific note is within the returned notes', async () => {
		const response = await api.get('/api/notes');

		const contents = response.body.map((e) => e.content);
		assert(contents.includes('HTML is easy'));
	});
});

describe('viewing a specific note', () => {
	beforeEach(async () => {
		await Note.deleteMany({});
		await Note.insertMany(helper.initialNotes);
	});
	test('succeds with a valid id', async () => {
		const notes = await helper.notesInDb();

		const initialNote = notes[0];

		const result = await api
			.get(`/api/notes/${initialNote.id}`)
			.expect(200)
			.expect('Content-type', /application\/json/);

		assert.deepStrictEqual(result.body, initialNote);
	});

	test('fails with statuscode 404 if note does not exist', async () => {
		const validNonexistingId = await helper.nonExistingId();

		await api.get(`/api/notes/${validNonexistingId}`).expect(404);
	});

	test('fails with statuscode 400 id is invalid', async () => {
		const invalidId = '5a3d5da59070081a82a3445';

		await api.get(`/api/notes/${invalidId}`).expect(400);
	});
});

describe('addition of a new note', () => {
	beforeEach(async () => {
		await Note.deleteMany({});
		await Note.insertMany(helper.initialNotes);
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
});

describe('deletion of a note', () => {
	beforeEach(async () => {
		await Note.deleteMany({});
		await Note.insertMany(helper.initialNotes);
	});
	test('a note can be delete', async () => {
		const notesDb = await helper.notesInDb();

		const noteToDelete = notesDb[1];

		await api.delete(`/api/notes/${noteToDelete.id}`).expect(204);

		const notesAtEnd = await helper.notesInDb();

		assert.strictEqual(notesAtEnd.length, notesDb.length - 1);
	});
});

after(async () => {
	await mongoose.connection.close();
});
