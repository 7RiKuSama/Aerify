package repository

import (
	"context"
	"github.com/7RiKuSama/Aerify/internal/models"
	"github.com/7RiKuSama/Aerify/internal/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepo struct {
	collection *mongo.Collection
}

func NewUsersRepo(collection *mongo.Collection) *UserRepo {
	return &UserRepo{collection: collection}
}

func (u *UserRepo) Create(ctx context.Context, user *models.User) (interface{}, error) {

	hashedPassoword, err := utils.HashPassword(user.Password)

	if err != nil {
		return nil, err
	}

	user.Password = hashedPassoword

	result, err := u.collection.InsertOne(ctx, user)

	if err != nil {
		return nil, err
	}

	return result.InsertedID, nil
}

func (u *UserRepo) GetUserByID(ctx context.Context, id primitive.ObjectID) (*models.User, error) {
	var user models.User
	err := u.collection.FindOne(ctx, bson.M{"_id": id}).Decode(&user)

	if err != nil {
		return nil, err
	}

	return &user, nil
}

func (u *UserRepo) DeleteUser(ctx context.Context, userID primitive.ObjectID) error {
	result, err := u.collection.DeleteOne(ctx, bson.M{"_id": userID})
	if err != nil {
		return err
	}

	if result.DeletedCount == 0 {
		return mongo.ErrNoDocuments
	}

	return nil
}

func (u *UserRepo) CheckUsername(ctx context.Context, username string) bool {
	var user models.User
	err := u.collection.FindOne(ctx, bson.M{"username": username}).Decode(&user)

	if err != nil {
		return false
	}

	return true
}

func (u *UserRepo) VerifyCredentials(ctx context.Context, password, username string) (primitive.ObjectID, error) {
	var user models.User
	err := u.collection.FindOne(ctx, bson.M{"username": username}).Decode(&user)

	if err != nil {
		return primitive.NilObjectID, err
	}

	err = utils.CheckPasswordHash(user.Password, password)

	if err != nil {
		return primitive.NilObjectID, err
	}

	return user.ID, nil
}


func (u *UserRepo) ExistsByUsernameOrEmail(ctx context.Context, username, email string) (bool, error) {
	filter := bson.M{
		"$or": []bson.M{
			{"username": username},
			{"email": email},
		},
	}

	err := u.collection.FindOne(ctx, filter).Err()
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil
		}
		return false, err // real error
	}

	return true, nil
}


func (u *UserRepo) UpdateUser(ctx context.Context, userId primitive.ObjectID, update *models.User) error {

	result, err := u.collection.UpdateOne(ctx, bson.M{"_id": userId}, bson.M{"$set": update})

	if err != nil {
		return err
	}

	if result.ModifiedCount == 0 {
		return mongo.ErrNoDocuments
	}

	return nil
}
