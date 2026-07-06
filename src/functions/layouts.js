const { ChannelType } = require("discord.js");

const themes = [
    "Gaming Hub", "Anime Kingdom", "Creator Studio", "Music Lounge", "Community Hangout",
    "Esports Arena", "Study Space", "Tech Lab", "Movie Night", "Art Gallery",
    "Roleplay Realm", "Support Center", "Trading Post", "Fitness Club", "Book Club",
    "Cafe Social", "Streamer Base", "Clan Fortress", "Podcast Room", "Event Plaza"
];

const styles = [
    {
        name: "Starter",
        categories: [
            { name: "welcome", text: ["rules", "announcements", "introductions"], voice: [] },
            { name: "community", text: ["general", "media", "polls"], voice: ["Lounge"] },
            { name: "support", text: ["help-desk", "suggestions"], voice: [] }
        ]
    },
    {
        name: "Events",
        categories: [
            { name: "info", text: ["rules", "news", "faq"], voice: [] },
            { name: "events", text: ["event-chat", "giveaways", "clips"], voice: ["Event Voice", "Stage Prep"] },
            { name: "off-topic", text: ["general", "memes"], voice: ["Chill VC"] }
        ]
    },
    {
        name: "Competitive",
        categories: [
            { name: "front-desk", text: ["rules", "announcements", "roles"], voice: [] },
            { name: "matchmaking", text: ["looking-for-team", "scrims", "results"], voice: ["Team 1", "Team 2"] },
            { name: "community", text: ["general", "highlights"], voice: ["Lobby"] }
        ]
    },
    {
        name: "Creator",
        categories: [
            { name: "start-here", text: ["rules", "updates", "resources"], voice: [] },
            { name: "creation", text: ["ideas", "showcase", "feedback"], voice: ["Collab Room"] },
            { name: "social", text: ["general", "self-promo"], voice: ["Hangout"] }
        ]
    },
    {
        name: "Support",
        categories: [
            { name: "information", text: ["rules", "announcements", "server-guide"], voice: [] },
            { name: "help", text: ["open-ticket", "common-questions", "bug-reports"], voice: ["Support VC"] },
            { name: "community", text: ["general", "success-stories"], voice: ["Public Lounge"] }
        ]
    }
];

function toKebabCase(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function buildLayouts() {
    const layouts = [];

    themes.forEach((theme, themeIndex) => {
        styles.forEach((style, styleIndex) => {
            const number = themeIndex * styles.length + styleIndex + 1;
            const themeSlug = toKebabCase(theme);
            layouts.push({
                id: number,
                name: `${theme} ${style.name}`,
                description: `AI-planned ${style.name.toLowerCase()} layout for a ${theme.toLowerCase()} server. It balances onboarding, community chat, and focused activity spaces.`,
                categories: style.categories.map((category) => ({
                    name: `${themeSlug}-${category.name}`,
                    channels: [
                        ...category.text.map((name) => ({ name: `${themeSlug}-${name}`, type: ChannelType.GuildText })),
                        ...category.voice.map((name) => ({ name, type: ChannelType.GuildVoice }))
                    ]
                }))
            });
        });
    });

    return layouts;
}

const layouts = buildLayouts();

function getRandomLayout() {
    return layouts[Math.floor(Math.random() * layouts.length)];
}

module.exports = {
    layouts,
    getRandomLayout
};
