const DynamoConstants = {

    TableName: 'realtime-chat-table',

    Indexes: {
        sortKey: 'sortKeyIndex',
    },

    Keys: {
        userPartitionKey: 'USER#',

        config: 'CONFIG',
    },
};

export { DynamoConstants };
