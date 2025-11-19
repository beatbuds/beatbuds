import React, { useState } from 'react';
import { supabase } from '../components/supabaseClient';
import '../styling/UserSearchPage.css';

function UserSearchPage() {
    const [query, setQuery] = useState('');
    const [status, setStatus] = useState('');
    const [user, setUser] = useState(null);      // holds found user
    const [notFound, setNotFound] = useState(false);

    async function downloadImage(path) {
        try {
            const { data, error } = await supabase.storage.from('profile-pics').download(path)
            if (error) {
                throw error
            }
            const url = URL.createObjectURL(data);
            setUser((prev) => ({...prev, avatar_url: url}));
        } catch (error) {
            console.log('Error downloading image: ', error.message)
        }
    }

    const handleSearch = async (e) => {
        e.preventDefault();
        setStatus('Searching...');
        setUser(null);
        setNotFound(false);

        const { data, error } = await supabase
            .from('users')
            .select('*')
            .ilike('name', `%${query}%`)
            .limit(1);

        if (error) {
            setStatus('Error searching');
            return;
        }

        if (data && data.length > 0) {
            console.log(data[0]);
            downloadImage(data[0].avatar_url);
            setUser(data[0]);
            setStatus('');
        } else {
            setNotFound(true);
            setStatus('');
        }
    };

    return (
        <div className="user-search-page">
            <form onSubmit={handleSearch} className="search-form">
                <label htmlFor="search-user-input">Search for Users by Name</label>
                <input
                    id="search-user-input"
                    type="text"
                    value={query}
                    placeholder="Jane Doe..."
                    onChange={(e) => setQuery(e.target.value)}
                    autoComplete="off"
                />
                <button type="submit">Search</button>
            </form>

            {status && <div className="status">{status}</div>}

            <div className="results">
                {user && (
                    <>
                        <h2>Search Results</h2>
                        <div className="user-card flex">
                            <img
                            src={user.avatar_url ? user.avatar_url : ``}
                            alt="profile picture"
                            className="avatar"
                            />
                            <p>Username: {user.name}</p>
                        </div>
                    </>
                )}

                {notFound && (
                <p className="no-results">No user found</p>
                )}
            </div>
        </div>
    );
}

export default UserSearchPage;
