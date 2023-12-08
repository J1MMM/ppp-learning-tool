import React, { Component } from 'react';

class UsersPrintable extends Component {
    render() {
        const { users } = this.props;
        console.log(users);

        return (
            <div style={{ padding: 8 }}>
                <h1 style={{ fontWeight: 500, marginBottom: 16 }}>List of Users</h1>
                <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', fontSize: 'xx-small' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>First Name</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>Last Name</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>Middle Name</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>Address</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>Sex</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>Phone Number</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            users.map((data, index) => {
                                return (
                                    <tr key={index}>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{data?.firstname}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{data?.lastname}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{data?.middlename}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{data?.address}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{data?.gender}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{data?.contactNo}</td>
                                        <td style={{ border: '1px solid black', padding: '8px' }}>{data?.email}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>
                </table>
            </div>
        );
    }
}


export default UsersPrintable;
