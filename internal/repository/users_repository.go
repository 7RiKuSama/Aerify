package repository

import (
	"context"

	"github.com/7RiKuSama/Aerify/internal/models"
	"github.com/7RiKuSama/Aerify/internal/utils"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type UserRepo struct {
	collection *mongo.Collection
}

func NewUsersRepo(collection *mongo.Collection) *UserRepo {
	return &UserRepo{collection: collection}
}

func (u *UserRepo) Create(ctx context.Context, user *models.User) (interface{}, error) {

	hashedPassword, err := utils.HashPassword(user.Password)

	if err != nil {
		return nil, err
	}

	user.Password = hashedPassword

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

func (u *UserRepo) VerifyPassword(ctx context.Context, password string, userID primitive.ObjectID) error {
	var user models.User
	err := u.collection.FindOne(ctx, bson.M{"_id": userID}).Decode(&user)

	if err != nil {
		return err
	}

	err = utils.CheckPasswordHash(user.Password, password)

	if err != nil {
		return err
	}

	return nil
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

func (u *UserRepo) CheckUsernameExist(ctx context.Context, username string) (bool, error) {
	
	err := u.collection.FindOne(ctx, bson.M{"username": username}).Err()
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil
		}
		return false, err
	}

	return true, nil
}

func (u *UserRepo) CheckEmailExist(ctx context.Context, email string) (bool, error) {
	
	err := u.collection.FindOne(ctx, bson.M{"email": email}).Err()
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return false, nil
		}
		return false, err
	}

	return true, nil
}




func (u *UserRepo) UpdateUser(ctx context.Context, userId primitive.ObjectID, update models.UpdatedUser) error {
	updateMap := bson.M{}

	if update.StateUsername {
		updateMap["username"] = update.Username
	}

	if update.StateEmail {
		updateMap["email"] = update.Email
	}

	if len(updateMap) == 0 {
		return nil // nothing to update
	}

	result, err := u.collection.UpdateOne(
		ctx,
		bson.M{"_id": userId},
		bson.M{"$set": updateMap},
	)
	if err != nil {
		return err
	}

	// ❌ This line is problematic if nothing changed
	// `ModifiedCount` is 0 if fields were already equal
	if result.MatchedCount == 0 {
		return mongo.ErrNoDocuments // true error
	}

	// ✅ Don't treat ModifiedCount == 0 as an error
	return nil
}


func (u *UserRepo) UpdatePassword(ctx context.Context, userID primitive.ObjectID, password string) error {
	hashedPassword, err := utils.HashPassword(password)
	if err != nil {
		return err
	}

	_, err = u.collection.UpdateOne(ctx, bson.M{"_id": userID}, bson.M{"$set": bson.M{"password": hashedPassword}})
	if err != nil {
		return err
	}

	return nil
}


func (u *UserRepo) CountUsers(ctx context.Context) (int64, error) {
	count, err := u.collection.CountDocuments(ctx, bson.M{})
	if err != nil {
		return 0, err
	}
	return count, nil
}

func (u *UserRepo) SearchUsers(ctx context.Context, query string) ([]*models.User, error) {
	filter := bson.M{
		"$or": []bson.M{
			{"username": bson.M{"$regex": query, "$options": "i"}},
			{"email": bson.M{"$regex": query, "$options": "i"}},
		},
	}

	cursor, err := u.collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var users []*models.User
	for cursor.Next(ctx) {
		var user models.User
		if err := cursor.Decode(&user); err != nil {
			return nil, err
		}
		users = append(users, &user)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

func (u *UserRepo) GetLast10Users(ctx context.Context) ([]*models.User, error) {
	opts := options.Find().SetSort(bson.D{{Key: "_id", Value: -1}}).SetLimit(10)
	cursor, err := u.collection.Find(ctx, bson.M{}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var users []*models.User
	for cursor.Next(ctx) {
		var user models.User
		if err := cursor.Decode(&user); err != nil {
			return nil, err
		}
		users = append(users, &user)
	}

	if err := cursor.Err(); err != nil {
		return nil, err
	}

	return users, nil
}
