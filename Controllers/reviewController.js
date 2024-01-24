import Review from '../models/ReviewSchema.js';
import Doctor from '../models/DoctorSchema.js';

export const getAllReviews = async (req, res) => {
    try {
        const reviews = await Review.find({});
        res.status(200).json({ success: true, message: 'Successful', data: reviews });
    } catch (err) {
        res.status(404).json({ success: false, message: 'Internal Server Error' });
    }
};

export const createReview = async (req, res) => {
    if (!req.body.doctor) req.body.doctor = req.params.doctorId;
    if (!req.body.user) req.body.user = req.userId;

    const newReview = new Review(req.body);

    try {
        const savedReview = await newReview.save();

        // Log the saved review
        console.log('Saved Review:', savedReview);

        await Doctor.findByIdAndUpdate(req.body.doctor, {
            $push: {
                reviews: savedReview._id,
            },
        });

        res.status(200).json({
            success: true,
            message: 'Review Successfully Submitted',
            data: savedReview,
        });
    } catch (err) {
        // Log any errors
        console.error('Error in createReview:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};