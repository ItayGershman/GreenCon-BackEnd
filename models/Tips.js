const {Schema,model} = require('mongoose');

const TipsSchema = new Schema ({
    id: {
        type: Number
    },
    content: {
        type: String,
        required: true
    }
});

module.exports = model('Tips',TipsSchema);
