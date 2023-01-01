package docrob.sarahvet.data;

import jakarta.persistence.*;
import lombok.*;

@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
@ToString
@Entity
@Table(name="stories")
public class Story {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 256)
    private String vetName;

    @Column
    private String photoData;

    @Column(nullable = true, length = 256)
    private String audioName;

    @Column(nullable = false, length = 256)
    private String storyTitle;

    @Column(nullable = false, length = 4096)
    private String story;

    @ManyToOne
    private User author;

}
