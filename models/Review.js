const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a Review title'],
  },

  text: {
    type: String,
    required: [true, 'Please add a description'],
  },
  rating: {
    type: Number,
    min: 1,
    max: 10,
    required: [true, 'Please add your rating'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'Bootcamp',
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
  },
});

// Prevent user from reviewing a bootcamp twice
ReviewSchema.index({ bootcamp: 1, user: 1 }, { unique: true });

// Static function on the Review schema so that we can have average reviews of a bootcamp
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
  const avg = await this.aggregate([
    {
      $match: { bootcamp: bootcampId },
    },
    {
      $group: {
        _id: '$bootcamp',
        averageRating: { $avg: '$rating' },
      },
    },
  ]);

  try {
    await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
      averageRating: avg[0].averageRating,
    });
  } catch (err) {
    console.log(err);
  }
};

// Adding average Cost to bootcamps after saving a course
ReviewSchema.post('save', function () {
  this.constructor.getAverageRating(this.bootcamp);
});

// getting the new Average Cost before removing Review
ReviewSchema.pre('remove', function () {
  this.constructor.getAverageRating(this.bootcamp);
});

module.exports = mongoose.model('Review', ReviewSchema);
