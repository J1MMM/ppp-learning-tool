import React, { Component } from 'react';

class StudentsPrintable extends Component {
    formatReadableDate = (dateString) => {
        const date = new Date(dateString);
        // Options for formatting the date (without time)
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        // Convert the date to a readable string
        return date.toLocaleString('en-US', options);
    };

    render() {
        const { students } = this.props;

        return (
            <div style={{ padding: 8 }}>
                <h1 style={{ fontWeight: 500, marginBottom: 8 }}>List of Students</h1>

                <table style={{ border: '1px solid black', width: '100%', borderCollapse: 'collapse', fontSize: 'xx-small' }}>
                    <thead>
                        <tr>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>First Name</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>Last Name</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>Middle Name</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>Address</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>Date of Birth</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>Sex</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>Phone Number</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>Parent/Guardian</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>Email</th>
                            <th style={{ border: '1px solid black', padding: '8px', backgroundColor: '#2DA544', color: '#FFF' }}>Learning Disabilities</th>
                        </tr>
                    </thead>
                    <tbody>
                        {students.map((data, index) => {
                            return (
                                <tr key={index}>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{data.firstname}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{data?.lastname}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{data?.middlename}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{data?.address}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{this.formatReadableDate(data?.birthday)}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{data?.gender}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{data?.contactNo}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{data?.guardian}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{data?.email}</td>
                                    <td style={{ border: '1px solid black', padding: '8px' }}>{data?.learning_disabilities.map(d => (`${d} `))}</td>
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


export default StudentsPrintable;
