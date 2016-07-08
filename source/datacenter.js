const IPadServer = API.create("http://mobileappqa.centerforautism.com/ipad");

// {
//     "IPadNotificationTypeID": 1,
//     "HREmployeeID": 28434,
//     "externalID": 12,
//     "questionJSON": "{\"shortText\": \"Question?\", \"questions\": [{\"text\": \"I can haz cheezberger?\"}]}"
// }

export default {
    getUsers() {
        return IPadServer.json("/device/list");
    },
    createNotification(id) {
        return IPadServer.json(
            "/notification/create",
            {
                post: {
                    IPadNotificationTypeID: 1,
                    HREmployeeID: id,
                    externalID: 1,
                    questionJSON: JSON.stringify({
                        shortText: `Question @ ${new Date()}`,
                        questions: [
                            {text: `Please respond ${Math.random() < 0.5 ? 'yes' : 'no'} to this question`}
                        ]
                    })
                }
            }
        );
    }
};
