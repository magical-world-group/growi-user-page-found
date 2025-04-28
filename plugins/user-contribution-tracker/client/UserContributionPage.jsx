// plugins/user-contribution-tracker/client/UserContributionPage.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserContributionPage = () => {
  const [contributors, setContributors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/user-contributions/_api/contributions')
      .then(res => {
        setContributors(res.data.contributors);
      })
      .catch(err => {
        console.error('Error loading contributions:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) return <div>ロード中...</div>;

  return (
    <div className="container mt-5">
      <h1>ユーザー貢献度一覧</h1>
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ユーザー名</th>
            <th>実質文字数（空白・記号除く）</th>
          </tr>
        </thead>
        <tbody>
          {contributors.map((user, idx) => (
            <tr key={idx}>
              <td>{user.username}</td>
              <td>{user.count.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserContributionPage;
