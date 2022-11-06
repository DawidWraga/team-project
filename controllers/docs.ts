import fs from 'fs';
import { join } from 'path';
import { remark } from 'remark';
import html from 'remark-html';
import matter from 'gray-matter';

const docsContentDirectory = join(process.cwd(), 'docsContent');

const getAllDocsSlugs = () => fs.readdirSync(docsContentDirectory);

export const getDocBySlug = (slug: string, fields: string[] = []) => {
	const realSlug = slug.replace(/\.md$/, '');
	const fullPath = join(docsContentDirectory, `${realSlug}.md`);
	const docsContent = fs.readFileSync(fullPath, 'utf8');
	const { content, data } = matter(docsContent);

	// const relevantData: { [key: string]: any } = {};

	// if (fields.includes('slug')) relevantData.slug = realSlug;
	// if (fields.includes('content')) relevantData.content = content;

	// fields.forEach((field) => {
	// 	if (typeof data[field] !== 'undefined') relevantData[field] = data[field];
	// });

	// return docsContent;

	const items: { [key: string]: any } = {};

	// Ensure only the minimal needed data is exposed
	fields.forEach((field) => {
		if (field === 'slug') {
			items[field] = realSlug;
		}
		if (field === 'content') {
			items[field] = content;
		}

		if (typeof data[field] !== 'undefined') {
			items[field] = data[field];
		}
	});

	return items;
};

export const getAllDocs = (fields: string[] = []) => {
	const slugs = getAllDocsSlugs();
	const docs = slugs.map((slug) => getDocBySlug(slug, fields));
	return docs;
};

export const markdownToHtml = async (markdown: string) => {
	return (await remark().use(html).process(markdown)).toString();
};
