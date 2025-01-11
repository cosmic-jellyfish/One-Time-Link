// index.js (located in the root directory)

const express = require('express');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
app.use(express.json());

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Route to serve view.html for /view/:id
app.get('/view/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'view.html'));
});

// Generate route - POST /api/generate
app.post('/api/generate', async (req, res) => {
    const { content, expiresIn } = req.body;
    if (!content) {
        return res.status(400).json({ message: 'Content is required' });
    }

    const id = uuidv4().toLowerCase();
    const expirationTime = new Date(Date.now() + (expiresIn ? parseInt(expiresIn) : 60) * 60000).toISOString();

    try {
        const { data, error } = await supabase
            .from('one_time_links')
            .insert([{ id, content, viewed: false, expiresAt: expirationTime }]);

        if (error) {
            return res.status(500).json({ message: 'Failed to create link', error });
        }

        const fullUrl = `https://${req.get('host')}/view/${id}`;
        res.json({ link: fullUrl });
    } catch (err) {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
});

// Content route - GET /api/content/:id
app.get('/api/content/:id', async (req, res) => {
    const id = req.params.id.toLowerCase();

    const { data: contentItems, error: fetchError } = await supabase
        .from('one_time_links')
        .select('*')
        .match({ id })
        .limit(1);

    if (fetchError) {
        return res.status(500).json({ message: 'Error fetching content' });
    }

    if (!contentItems || contentItems.length === 0) {
        return res.status(404).json({ message: 'Content not found' });
    }

    const contentItem = contentItems[0];

    // Check if content is expired
    const isExpired = new Date() > new Date(contentItem.expiresAt);

    if (contentItem.viewed || isExpired) {
        // If the content is expired or already viewed, mark it as expired
        await supabase
            .from('one_time_links')
            .update({ expired: true })
            .match({ id });
        
        return res.status(410).json({ message: 'This content has already been viewed or has expired' });
    }

    // Mark the content as viewed (for one-time access)
    const { error: updateError } = await supabase
        .from('one_time_links')
        .update({ viewed: true })
        .match({ id });

    if (updateError) {
        return res.status(500).json({ message: 'Failed to update viewed status' });
    }

    res.json({ content: contentItem.content });
});

// Export the app for Vercel
module.exports = app;

// Start the server when running locally
if (require.main === module) {
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
        console.log(`Express server listening on port ${port}`);
    });
}
