const fs = require("fs");
const path = require("path");
const { ChannelType } = require("discord.js");

const layoutRoot = path.join(__dirname, "..", "layouts");
const layoutCategories = ["gaming", "community", "anime", "aesthetic", "cozy", "marketplace", "study", "business"];
const channelTypes = {
    text: ChannelType.GuildText,
    voice: ChannelType.GuildVoice
};

function normalizeLayout(layout, category, index) {
    return {
        id: `${category}-${index + 1}`,
        category,
        name: layout.name,
        description: layout.description,
        categories: layout.categories.map((serverCategory) => ({
            name: serverCategory.name,
            channels: serverCategory.channels.map((channel) => ({
                name: channel.name,
                type: channelTypes[channel.type] || ChannelType.GuildText
            }))
        }))
    };
}

function loadLayoutsByCategory() {
    return layoutCategories.reduce((collection, category) => {
        const categoryPath = path.join(layoutRoot, category);
        const files = fs.readdirSync(categoryPath).filter((file) => file.endsWith(".json")).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

        collection[category] = files.map((file, index) => {
            const layout = JSON.parse(fs.readFileSync(path.join(categoryPath, file), "utf8"));
            return normalizeLayout(layout, category, index);
        });

        return collection;
    }, {});
}

const layoutsByCategory = loadLayoutsByCategory();
const layouts = Object.values(layoutsByCategory).flat();

function getRandomLayout(category) {
    const source = category ? layoutsByCategory[category] : layouts;
    return source[Math.floor(Math.random() * source.length)];
}

module.exports = {
    layoutCategories,
    layoutsByCategory,
    layouts,
    getRandomLayout
};
