const DynamoConstants = {

    TableName: 'realtime-chat-table',

    Indexes: {
        sortKey: 'sortKeyIndex',
    },

    Keys: {
        userPartitionKey: 'USER#',

        config: 'CONFIG',
        connection: 'CONNECTION#',
    },

    Query: {
        byPartitionKey: 'pk = :pk and begins_with(sk, :sk)',
        bySortKey: 'sk = :sk and begins_with(pk, :pk)',
    },
};

export { DynamoConstants };
