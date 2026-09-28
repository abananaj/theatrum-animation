// Writes dist/effects.json (category → effect → variant classes) from the live REGISTRY, so the PHP settings page can list effects without re-declaring them.
import { createServer } from 'vite';
import { writeFileSync, mkdirSync } from 'node:fs';

const server = await createServer({
	configFile: false,
	logLevel: 'error',
	appType: 'custom',
	server: { middlewareMode: true },
});

try {
	const { REGISTRY } = await server.ssrLoadModule('/src/config/registry.ts');
	const effects = [];
	for (const [categoryId, category] of Object.entries(REGISTRY)) {
		for (const [effectId, group] of Object.entries(category.animations)) {
			effects.push({
				id: effectId,
				label: group.label,
				category: category.label,
				categoryId,
				classes: Object.keys(group.configs),
			});
		}
	}
	mkdirSync('dist', { recursive: true });
	writeFileSync('dist/effects.json', `${JSON.stringify(effects, null, '\t')}\n`);
	console.log(`effects.json: ${effects.length} effects`);
} finally {
	await server.close();
}
