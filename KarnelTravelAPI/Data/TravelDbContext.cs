using Microsoft.EntityFrameworkCore;
using KarnelTravelAPI.Models;

namespace KarnelTravelAPI.Data
{
    public class TravelDbContext : DbContext
    {
        public TravelDbContext(DbContextOptions<TravelDbContext> options)
            : base(options)
        {
        }

        public DbSet<TouristSpot> TouristSpots { get; set; }

        public DbSet<Hotel> Hotels { get; set; }

        public DbSet<Restaurant> Restaurants { get; set; }

        public DbSet<Resort> Resorts { get; set; }

        public DbSet<Admin> Admins { get; set; }

        public DbSet<User> Users { get; set; }

        public DbSet<Booking> Bookings { get; set; }

        public DbSet<HotelRating> HotelRatings { get; set; }

        public DbSet<RestaurantRating> RestaurantRatings { get; set; }

        public DbSet<TouristSpotRating> TouristSpotRatings { get; set; }

        public DbSet<ResortRating> ResortRatings { get; set; }

        public DbSet<Trip> Trips { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);


            // =====================================================
            // HOTEL RATING
            // ONE RATING PER USER PER HOTEL
            // =====================================================

            modelBuilder.Entity<HotelRating>()
                .HasIndex(x => new
                {
                    x.HotelId,
                    x.UserId
                })
                .IsUnique();


            modelBuilder.Entity<HotelRating>()
                .HasOne(x => x.Hotel)
                .WithMany()
                .HasForeignKey(x => x.HotelId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<HotelRating>()
                .HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            // =====================================================
            // RESTAURANT RATING
            // ONE RATING PER USER PER RESTAURANT
            // =====================================================

            modelBuilder.Entity<RestaurantRating>()
                .HasIndex(x => new
                {
                    x.RestaurantId,
                    x.UserId
                })
                .IsUnique();


            modelBuilder.Entity<RestaurantRating>()
                .HasOne(x => x.Restaurant)
                .WithMany()
                .HasForeignKey(x => x.RestaurantId)
                .OnDelete(DeleteBehavior.Cascade);


            modelBuilder.Entity<RestaurantRating>()
                .HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            // =====================================================
            // TOURIST SPOT RATING
            // ONE RATING PER USER PER TOURIST SPOT
            // =====================================================

            modelBuilder.Entity<TouristSpotRating>()
                .HasIndex(x => new
                {
                    x.TouristSpotId,
                    x.UserId
                })
                .IsUnique();


            // TOURIST SPOT RELATIONSHIP

            modelBuilder.Entity<TouristSpotRating>()
                .HasOne(x => x.TouristSpot)
                .WithMany()
                .HasForeignKey(x => x.TouristSpotId)
                .OnDelete(DeleteBehavior.Cascade);


            // TOURIST SPOT RATING → USER

            modelBuilder.Entity<TouristSpotRating>()
                .HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            // =====================================================
            // RESORT RATING
            // ONE RATING PER USER PER RESORT
            // =====================================================

            modelBuilder.Entity<ResortRating>()
                .HasIndex(x => new
                {
                    x.ResortId,
                    x.UserId
                })
                .IsUnique();


            // RESORT RATING → RESORT

            modelBuilder.Entity<ResortRating>()
                .HasOne(x => x.Resort)
                .WithMany()
                .HasForeignKey(x => x.ResortId)
                .OnDelete(DeleteBehavior.Cascade);


            // RESORT RATING → USER

            modelBuilder.Entity<ResortRating>()
                .HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId)
                .OnDelete(DeleteBehavior.Cascade);


            // =====================================================
            // TRIP → USER
            // ONE USER CAN HAVE MANY TRIPS
            // =====================================================

            modelBuilder.Entity<Trip>()
            .HasOne(x => x.User)
            .WithMany()
            .HasForeignKey(x => x.UserId)
            .OnDelete(DeleteBehavior.Cascade);    
        }
    }
}
