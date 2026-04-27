/**
 * Mongoose Plugin for Soft Delete
 */
module.exports = (schema) => {
    schema.add({ isDeleted: { type: Boolean, default: false } });

    schema.pre(/^find/, async function() {
        // If isDeleted is not explicitly set in the query, default to false
        if (this.getQuery().isDeleted === undefined) {
            this.where({ isDeleted: false });
        }
    });

    schema.pre('aggregate', function() {
        this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
    });

    schema.methods.softDelete = async function() {
        this.isDeleted = true;
        return this.save();
    };
};
